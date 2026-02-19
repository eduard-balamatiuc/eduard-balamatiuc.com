export function slugifyDispatchTitle(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function compareDispatchPublishedAt(a, b) {
  const dateA = new Date(a.date).getTime();
  const dateB = new Date(b.date).getTime();

  if (dateB !== dateA) {
    return dateB - dateA;
  }

  if (a.time && b.time) {
    return b.time.localeCompare(a.time);
  }

  return 0;
}
