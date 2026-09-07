export function isCompanySearchShortcut(
  event: Pick<KeyboardEvent, "key" | "ctrlKey" | "metaKey">,
) {
  return (
    (event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k"
  );
}
