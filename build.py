import os, shutil

def build(env):
    if env not in ["libretexts", "normal"]:
        raise ValueError("Environment must be 'libretexts' or 'normal'")

    shutil.rmtree("dist", ignore_errors=True)
    shutil.copytree("shared", "dist")
    shutil.copytree(env, "dist", dirs_exist_ok=True)

    for root, _, files in os.walk("dist/html"):
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read().replace("__ENV__", env)
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)

    print(f"✅ Built {env} version successfully!")

# Example:
# build("libretexts")
# build("normal")
