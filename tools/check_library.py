import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LIBRARY = ROOT / "extension" / "library"
TITLE = re.compile(r"^\*\*`.+`\*\* — \S")
REFERENCE = re.compile(r"`([A-Za-z_][\w$]*)`")
IMAGE = re.compile(r"""!\[[^\]]*\]\(([^)\s]+)|<img[^>]*\ssrc=["']([^"']+)["']""")
WHOLE_IMAGE = re.compile(r"!\[[^\]]*\]\([^)]*\)|<img[^>]*>")
THEMES = ("dark", "light")


def sections(text):
    """Split a page at its --- lines outside code fences, as the hover does."""
    parts, fenced = [[]], False
    for line in text.splitlines():
        if line.lstrip().startswith("```"):
            fenced = not fenced
        if not fenced and re.fullmatch(r"---\s*", line):
            parts.append([])
        else:
            parts[-1].append(line)
    return ["\n".join(lines).strip() for lines in parts]


def check_layout(text):
    """A page with a visual is: description --- **Coding example** + code --- **Visual** + images."""
    parts = sections(text)
    if len(parts) != 3:
        return "a page with a visual needs description --- Coding example --- Visual"
    description, example, visual = parts
    if IMAGE.search(description) or IMAGE.search(example):
        return "images belong only in the Visual section"
    if not example.startswith("**Coding example**\n\n```"):
        return "second section must be **Coding example** followed by a code block"
    if not visual.startswith("**Visual**\n\n") or WHOLE_IMAGE.sub("", visual[len("**Visual**"):]).strip():
        return "third section must be **Visual** followed only by images"
    return None


def check_image(tag, src):
    """An image is either the file itself or a <name>.dark/.light pair next to the page."""
    if src != src.lower():
        return f"image {src} is not lowercase"
    stem, dot, ext = src.rpartition(".")
    variants = [tag / f"{stem}.{theme}.{ext}" for theme in THEMES] if dot else []
    found = [v for v in variants if v.is_file()]
    if found and len(found) < len(variants):
        missing = next(v.name for v in variants if not v.is_file())
        return f"image {src} has no {missing}"
    if not found and not (tag / src).is_file():
        return f"image {src} not found"
    return None


def check_folder(folder):
    problems = []
    tags = sorted(d for d in folder.iterdir() if d.is_dir())
    pages = {d.name for d in tags}
    for d in tags:
        if not (d / f"{d.name}.md").is_file():
            problems.append(f"{d.name}/: no {d.name}.md")
    for stray in sorted(folder.glob("*.md")):
        problems.append(f"{stray.name}: page outside a tag folder")
    alias_file = folder / "aliases.json"
    aliases = json.loads(alias_file.read_text(encoding="utf-8")) if alias_file.exists() else {}
    patterns = [re.compile("^" + ".*".join(map(re.escape, glob.split("*"))) + "$") for glob in aliases]

    for glob, target in aliases.items():
        if target not in pages:
            problems.append(f"{alias_file.name}: {glob} points at missing page {target}")
        if "*" not in glob and glob in pages:
            problems.append(f"{alias_file.name}: {glob} is shadowed by its own page")

    for tag in tags:
        page = tag / f"{tag.name}.md"
        if not page.is_file():
            continue
        text = page.read_text(encoding="utf-8")
        lines = text.splitlines()
        if not lines or not TITLE.match(lines[0]):
            problems.append(f"{page.name}: first line is not a '**`name`** — summary' title")
        if text.count("```") % 2:
            problems.append(f"{page.name}: unbalanced code fence")
        if not text.endswith("\n"):
            problems.append(f"{page.name}: no trailing newline")
        if IMAGE.search(text):
            problem = check_layout(text)
            if problem:
                problems.append(f"{page.name}: {problem}")
        for match in IMAGE.finditer(text):
            src = match.group(1) or match.group(2)
            if re.match(r"^[a-z]+:", src):
                continue
            problem = check_image(tag, src)
            if problem:
                problems.append(f"{page.name}: {problem}")
        for line in lines:
            if not line.startswith("**See also**"):
                continue
            for name in REFERENCE.findall(line):
                if name not in pages and not any(p.match(name) for p in patterns):
                    problems.append(f"{page.name}: See also names unknown page {name}")
    return len(pages), len(aliases), problems


def main():
    names = sys.argv[1:] or ["sv", "uvm"]
    failed = False
    for name in names:
        pages, aliases, problems = check_folder(LIBRARY / name)
        print(f"{name}: {pages} pages, {aliases} aliases, {len(problems)} problem(s)")
        for problem in problems:
            print(f"  {problem}")
        failed = failed or bool(problems)
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
