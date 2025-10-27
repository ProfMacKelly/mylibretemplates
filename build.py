import os
import shutil
import sys
from textwrap import shorten

# === Color Codes ===
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
CYAN = "\033[96m"
RESET = "\033[0m"
BOLD = "\033[1m"

# === Directory Paths ===
SHARED_HTML = "shared/html"
SHARED_CSS = "shared/css"
SHARED_JS = "shared/js"

LIBRETEXTS = "libretexts"
NORMAL = "normal"

LIBRETEXTS_HTML = os.path.join(LIBRETEXTS, "html")
LIBRETEXTS_CSS = os.path.join(LIBRETEXTS, "css")
LIBRETEXTS_JS = os.path.join(LIBRETEXTS, "js")

NORMAL_HTML = os.path.join(NORMAL, "html")
NORMAL_CSS = os.path.join(NORMAL, "css")
NORMAL_JS = os.path.join(NORMAL, "js")

# === Link Patterns ===
REMOTE_CSS = "https://profmackelly.github.io/text-project/style.css"
REMOTE_JS = "https://profmackelly.github.io/text-project/script.js"

LOCAL_CSS = "../css/style.css"
LOCAL_JS = "../js/script.js"


# === Helper Functions ===
def clean_build_dirs(envs):
    """Remove old environment folders for a clean rebuild."""
    for d in envs:
        if os.path.exists(d):
            shutil.rmtree(d)
            print(f"{YELLOW}🧹 Removed old '{d}' directory.{RESET}")
    print(f"{CYAN}✨ Clean build environment ready.{RESET}\n")


def ensure_dirs():
    """Ensure new output directories exist."""
    for d in [
        LIBRETEXTS_HTML, LIBRETEXTS_CSS, LIBRETEXTS_JS,
        NORMAL_HTML, NORMAL_CSS, NORMAL_JS,
    ]:
        os.makedirs(d, exist_ok=True)


def copy_shared_assets(target_envs):
    """Copy shared CSS and JS into selected environment directories."""
    for env in target_envs:
        css_target = LIBRETEXTS_CSS if env == "libretexts" else NORMAL_CSS
        js_target = LIBRETEXTS_JS if env == "libretexts" else NORMAL_JS

        for file in os.listdir(SHARED_CSS):
            if file.endswith(".css"):
                shutil.copy2(os.path.join(SHARED_CSS, file), os.path.join(css_target, file))
        for file in os.listdir(SHARED_JS):
            if file.endswith(".js"):
                shutil.copy2(os.path.join(SHARED_JS, file), os.path.join(js_target, file))

    print(f"{CYAN}📁 Shared CSS and JS copied for: {', '.join(target_envs)}{RESET}\n")


def process_html(file_name, env):
    """Convert HTML paths for CSS/JS based on environment and save output."""
    src_path = os.path.join(SHARED_HTML, file_name)
    with open(src_path, "r", encoding="utf-8") as f:
        html = f.read()

    if env == "libretexts":
        html = html.replace(LOCAL_CSS, REMOTE_CSS).replace(LOCAL_JS, REMOTE_JS)
        dest_path = os.path.join(LIBRETEXTS_HTML, file_name)
    elif env == "normal":
        html = html.replace(REMOTE_CSS, LOCAL_CSS).replace(REMOTE_JS, LOCAL_JS)
        dest_path = os.path.join(NORMAL_HTML, file_name)
    else:
        raise ValueError("Environment must be 'libretexts' or 'normal'.")

    with open(dest_path, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"{GREEN}✅ {env.capitalize()} HTML built:{RESET} {dest_path}")
    return dest_path


def build(target_envs, clean=True):
    """Perform a rebuild for selected environments, with optional cleaning."""
    env_dirs = {"libretexts": LIBRETEXTS, "normal": NORMAL}

    if clean:
        clean_build_dirs([env_dirs[e] for e in target_envs])
    else:
        print(f"{YELLOW}⚡ Skipping clean step (using existing directories).{RESET}\n")

    ensure_dirs()
    copy_shared_assets(target_envs)

    html_files = [f for f in os.listdir(SHARED_HTML) if f.endswith(".html")]
    if not html_files:
        print(f"{RED}⚠️ No HTML files found in shared/html/{RESET}")
        return

    summary = []

    for env in target_envs:
        for file_name in html_files:
            path = process_html(file_name, env)
            summary.append((file_name, env, path))

    # Summary table
    print(f"\n{BOLD}{CYAN}📄 Build Summary:{RESET}\n" + "-" * 70)
    print(f"{'File Name':<25} {'Environment':<15} {'Output Path'}")
    print("-" * 70)
    for file_name, env, path in summary:
        print(f"{shorten(file_name, 25):<25} {env:<15} {path}")
    print("-" * 70)
    print(f"\n{GREEN}🎉 Build completed for:{RESET} {', '.join(target_envs)}\n")


if __name__ == "__main__":
    args = [a.lower() for a in sys.argv[1:]]
    valid_envs = {"libretexts", "normal"}
    clean = True

    # Detect optional flag
    if "--no-clean" in args:
        clean = False
        args.remove("--no-clean")

    if not args:
        target_envs = ["libretexts", "normal"]
    else:
        target_envs = [a for a in args if a in valid_envs]
        if not target_envs:
            print(f"{RED}❌ Invalid argument.{RESET} Use 'libretexts', 'normal', or '--no-clean'.")
            sys.exit(1)

    build(target_envs, clean=clean)
