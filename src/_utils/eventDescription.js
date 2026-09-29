import striptags from "striptags";

// Some event descriptions have <html-blob>s in them, which need
// stripping before front matter (tags/canonical) can be parsed out.
export function stripEventHtml(input) {
  if (input === undefined || input[0] !== "<") {
    return input;
  }

  return striptags(input, ["br"]).replaceAll("<br>", "\r\n");
}
