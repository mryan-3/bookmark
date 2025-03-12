import { compressToEncodedURIComponent as compress, decompressFromEncodedURIComponent as decompress } from "lz-string"

export function compressToEncodedURIComponent(input: string): string {
  return compress(input)
}

export function decompressFromEncodedURIComponent(input: string): string {
  return decompress(input)
}

