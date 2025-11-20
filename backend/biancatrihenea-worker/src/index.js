
const bcrypt = require('bcryptjs');

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

const testURL = "https://pub-7d691ed4c6f245279280ca86bc185523.r2.dev"; // real later

// ✅ Add proper CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

async function getItems(request, env) {
  try {
    const stmt = env.DB.prepare("SELECT * FROM biancatrihenea ORDER BY date DESC");
    const { results } = await stmt.all();

    for (let i = 0; i < results.length; i++) {
      const folderPath = "biancatrihenea/" + results[i]["pid"] + "/";
      console.log(folderPath);
      const { objects } = await env.PORTFOLIO_STORAGE.list({ prefix: folderPath });

      const imageUrls = objects.map(obj =>
        `${testURL}/${obj.key}?t=${obj.uploaded || Date.now()}`
      );

      results[i].imageURLs = imageUrls;
    }

    return new Response(JSON.stringify(results, null, 2), {
      status: 200,
      headers: {
        "content-type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (e) {
    console.error("DB or R2 error:", e);
    return new Response("Error: resource not found!", {
      status: 404,
      headers: { ...corsHeaders },
    });
  }
}

async function getAbout(request, env) {
  try {
    const aboutResult = await env.DB.prepare('SELECT about FROM biancatrihenea_about LIMIT 1').first();
    const aboutText = aboutResult?.about || '';

    // Get multiple rows from another table
    const itemsResult = await env.DB.prepare('SELECT * FROM biancatrihenea_links ORDER BY id').all();

    // Combine into one JSON object
    const results = {
      about: aboutText,
      links: itemsResult.results || []
    };

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        "content-type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (e) {
    console.error("DB or R2 error:", e);
    return new Response("Error: resource not found!", {
      status: 404,
      headers: { ...corsHeaders },
    });
  }
}

async function postAbout(request, env) {
  const contentType = request.headers.get("content-type");
  if (contentType.includes("application/json")) {
    const db = env.DB;
    try {
      const jsonIn = await request.json();
      console.log("Received JSON:", jsonIn);
      const aboutRez = await db.prepare('UPDATE biancatrihenea_about SET about = (?) WHERE rowid = 1').bind(jsonIn["about"]);
      await aboutRez.all();
      await db.exec('DELETE FROM biancatrihenea_links');
      for (const { text, link } of jsonIn["links"]) {
        await db.prepare('INSERT INTO biancatrihenea_links (text, link) VALUES (?, ?)').bind(text, link).run();
      }
      return new Response("Successfully received POST.", {
        status: 200,
        headers: { ...corsHeaders },
      });
    } catch (error) {
      return new Response('Error: ' + error.message, { status: 500 });
    }
  } else {
    return new Response("Malformed POST JSON.", {
      status: 400,
      headers: { ...corsHeaders },
    });
  }
}

async function postProject(request, env) {
  const contentType = request.headers.get("content-type");
  if (contentType.includes("application/json")) {
    const db = env.DB;
    try {
      const jsonIn = await request.json();
      const newRow = await db.prepare(`
        INSERT OR IGNORE INTO biancatrihenea (pid) VALUES (?)
      `).bind(jsonIn["pid"]);
      await newRow.all();
      const projRez = await db.prepare(`
        UPDATE biancatrihenea
        SET
            projectname = (?),
            date = (?),
            description = (?),
            dimensions = (?)
        WHERE
            pid == (?);
      `).bind(jsonIn["projectname"], jsonIn["date"], jsonIn["description"], jsonIn["dimensions"], jsonIn["pid"]);
      await projRez.all();
      
      return new Response("Successfully received POST.", {
        status: 200,
        headers: { ...corsHeaders },
      });
    } catch (error) {
      return new Response('Error: ' + error.message, { status: 500 });
    }
  } else if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const pid = formData.get("pid");

    const order = JSON.parse(formData.get("order") || "[]");
    const toDelete = JSON.parse(formData.get("delete") || "[]");

    const folder = `biancatrihenea/${pid}/`;

    // 1. Delete removed images
    for (const url of toDelete) {
        const key = folder + url.split('/').pop();
        await env.PORTFOLIO_STORAGE.delete(key);
    }

    let toReplace = [];

    // 1.5 add new images
    let i = 0;
    for (const item of order) {
      const filepath = item["value"];
      const index = String(i).padStart(4, "0");
      if (item["type"] == "new") {
        const newKey = folder + index + ".jpegA";
        const file = formData.get(item["fname"]);
        await env.PORTFOLIO_STORAGE.put(newKey, file.stream(), {
          httpMetadata: { contentType: file.type },
        });
        item["type"] = "existing";
        toReplace.push(newKey);
      }
      i += 1;
      
    }

    // 2. Upload new images with deterministic index names
    i = 0;
    for (const item of order) {
      const filepath = item["value"];
      const index = String(i).padStart(4, "0");

      const newKey = folder + index + ".jpegA";
      const oldName = filepath.split('/').pop();
      const oldKey = `${folder}${oldName}.jpeg`;
      console.log("oldname:", oldName, "index:", index);
      if (oldName != index) {
        console.log(oldKey, newKey);
        const object = await env.PORTFOLIO_STORAGE.get(oldKey);
        if (!object) continue;
        const objData = await object.arrayBuffer();
        
        await env.PORTFOLIO_STORAGE.put(newKey, objData);
        await env.PORTFOLIO_STORAGE.delete(oldKey);
        toReplace.push(newKey);
      }
      i++;
    }

    for (const name of toReplace) {
      const newKey = name.slice(0, -1);
      console.log(name, newKey);
      const object = await env.PORTFOLIO_STORAGE.get(name);
      if (!object) continue;

      const objData = await object.arrayBuffer();
      await env.PORTFOLIO_STORAGE.put(newKey, objData);
      await env.PORTFOLIO_STORAGE.delete(name);
    }

    return new Response("Successfully uploaded images.", {
      status: 200,
      headers: { ...corsHeaders },
    });
  } else {
    return new Response("Malformed POST content type.", {
      status: 400,
      headers: { ...corsHeaders },
    });
  }
}

async function handleDelete(request, env, toDelete) {
  try {
    console.log("in delete function");
    const db = env.DB;
    const result = await db.prepare("DELETE FROM biancatrihenea WHERE pid = (?)").bind(toDelete).run();

    console.log("result:", result);

    const folderPath = "biancatrihenea/" + toDelete + "/";
    console.log(folderPath);
    const { objects } = await env.PORTFOLIO_STORAGE.list({ prefix: folderPath });
    for (const obj of objects) {
      await env.PORTFOLIO_STORAGE.delete(obj.key);
    }

    return new Response("Successfully deleted item.", {
      status: 200,
      headers: { ...corsHeaders },
    });
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 });
  }
}

async function hashPassword(password) {
  const salt = "$2b$10$aPWQBpdJECQfzeujfxGgmu";
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function checkLogin(passwordIn) {
  const hashedPassword = "$2b$10$aPWQBpdJECQfzeujfxGgmuePTQ3G4.TH7bPvy0W2ymcJ4qrRj4Uti";
  if (passwordIn == null) {
    return false;
  }
  try {
    const hashedIn = await hashPassword(passwordIn);
    console.log("Hashed password in:", hashedIn);
    console.log("Hashed password correct:", hashedPassword);
    return hashedIn == hashedPassword;
  } catch (error) {
    console.error("Failed to hash password in main:", error);
    return false;
  }
  
}


export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const page = url.searchParams.get('page');
    const passwordIn = url.searchParams.get('password');
    const method = request.method;

    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders,
        }
      });
    }

    if (method === "GET") {
      if (page == "about") {
        return getAbout(request, env);
      } else {
        return getItems(request, env);
      }
    } else if (method === "POST") {
      console.log("checking: ", passwordIn);
      if (await checkLogin(passwordIn) == false) {
        return new Response("Invalid credentials.", {
          status: 401,
          headers: { ...corsHeaders },
        });
      }

      if (url.searchParams.has('delete')) {
        const toDelete = parseInt(url.searchParams.get('delete'));
        console.log("deleting:", url);
        return handleDelete(request, env, toDelete);
      }

      if (page == "about") {
        return postAbout(request, env);
      } else if (page == "login") {
        return new Response("Login successful.", {
          status: 200,
          headers: { ...corsHeaders },
        });
      } else {
        return postProject(request, env);
      }
    } else {
      return new Response(`Unsupported method: ${method}`, {
        status: 405,
        headers: corsHeaders,
      });
    }
  },
};
