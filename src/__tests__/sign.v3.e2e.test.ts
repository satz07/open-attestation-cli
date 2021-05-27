import { sign } from "../implementations/sign";
import fs from "fs";
import path from "path";
import tmp from "tmp";
import { SUPPORTED_SIGNING_ALGORITHM } from "@govtechsg/open-attestation";

const fixtureFolderName = "fixture/3.0";
const wrappedFileName1 = `${fixtureFolderName}/did-wrapped.json`;
const wrappedFileName2 = `${fixtureFolderName}/dnsdid-wrapped.json`;

describe("sign", () => {
  it("should sign documents when folder contain multiple valid open attestation documents", async () => {
    const inputDirectory = tmp.dirSync();
    const outputDirectory = tmp.dirSync();
    fs.copyFileSync(
      path.resolve(__dirname, wrappedFileName1),
      path.resolve(__dirname, `${inputDirectory.name}/did.json`)
    );
    fs.copyFileSync(
      path.resolve(__dirname, wrappedFileName2),
      path.resolve(__dirname, `${inputDirectory.name}/dnsDid.json`)
    );

    await sign({
      rawDocumentsPath: inputDirectory.name,
      outputDir: outputDirectory.name,
      key: "0x0000000000000000000000000000000000000000000000000000000000000003",
      publicKey: "did:ethr:0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69#controller",
      algorithm: SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
    });

    const file1 = JSON.parse(fs.readFileSync(`${outputDirectory.name}/did.json`, { encoding: "utf8" }));
    const file2 = JSON.parse(fs.readFileSync(`${outputDirectory.name}/dnsDid.json`, { encoding: "utf8" }));

    expect(file1.proof).toMatchObject({
      type: "OpenAttestationMerkleProofSignature2018",
      proofPurpose: "assertionMethod",
      targetHash: "d93a4faa756746cf54bd0a8d92c12ed2142a92a46b4adfe8fbe58a6423211022",
      proofs: [],
      merkleRoot: "d93a4faa756746cf54bd0a8d92c12ed2142a92a46b4adfe8fbe58a6423211022",
      salts:
        "W3sidmFsdWUiOiI5OTQzNWE0NWM1YjQ5YzVkYTRhZjc3OWU3NTdmOGQ1MWY5ZDI4ZWQwMjgwYzU0NDhhZTRiZmE5Y2I4OGJlMDVhIiwicGF0aCI6InZlcnNpb24ifSx7InZhbHVlIjoiYTRlNDk3Mjc4ZGFkM2Q3MWExYzdmYjAwNDM0YjU5ZGE4ZTYzOTRhOWNlMzdjMWY2MjQ5MzlhNTdmOGZjZDFiMiIsInBhdGgiOiJAY29udGV4dFswXSJ9LHsidmFsdWUiOiI1YjYxYzliY2Y0N2E2Y2M0NWQ1MTQ5MWQ5OTlhOTI5Y2I4OGZhZDEzY2E4YzYwNTk0ZGQ0MzkyM2E1NmQ2YzRmIiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6IjgzMTEzNmQzYzM2MmRmOTk1OTI0NDUyYjc4OGQzYWQ1NjIyOTJjMDU5Y2M1YmEyZjkzMjBkMzNkOGYzYzM0NjkiLCJwYXRoIjoiQGNvbnRleHRbMl0ifSx7InZhbHVlIjoiYTFhODkyN2NlNmU4NWRmODJjYTRjNzE3MGI0NzczMDg1ZmZhMjU1MTMxZDM2MGMyMGY4NWVjZGUwMTJmOTY2MSIsInBhdGgiOiJAY29udGV4dFszXSJ9LHsidmFsdWUiOiJiM2Y1MjZmNWY4YjhjNjMzOTVlMDZlODg3N2E2YTNmZWRiMTkwNjQ5NGI0MzYxYjFhMmU3YjlkMDExN2Q5ZjdhIiwicGF0aCI6InJlZmVyZW5jZSJ9LHsidmFsdWUiOiJjYjhkZWYwYTNhZjFhMzc2NzFiMGZlODEyYjhkYzc1YjMwZTkwMDgzMjI0MmQ3ZDRhZDczNTYzZDc1NzkzZTU5IiwicGF0aCI6Im5hbWUifSx7InZhbHVlIjoiZGFkY2JkYzgzOTRhYTYxNTdlMmYwNGVkOTg5OWYxMDhmZmZiYzJkMTY4ZWJkNDkzZmJkNDc0YWY3ZjViNTlhNyIsInBhdGgiOiJpc3N1YW5jZURhdGUifSx7InZhbHVlIjoiY2U2ZmRlOGE4ZjMzNzY3OGY1YTE4ZmM2MGNlYTNiN2ZhNzdhZTkzNzE3NDI5NmQ5OGEzODE1MzY5OGNlMmUyZiIsInBhdGgiOiJ2YWxpZEZyb20ifSx7InZhbHVlIjoiNDQ2NTYwMTJhODhkMzczZGY3OTkwNWU5ZTFlNTIxOTZhNzgyMzhlMTFiYzZlZjk2MTc4NThlNTk1YTVkYWQxNiIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiNWE2MzdmN2ZiMGQ0NzI1MDY1MDJkNzA1MjcwNWQ1YTZiZmFiYzYyYzJiYzdkNTYzM2E5NzEwNTE4ZGJmNWFlNiIsInBhdGgiOiJpc3N1ZXIubmFtZSJ9LHsidmFsdWUiOiI2ZTQ3MzQxYTdjYzVmNTFlMTFjN2IxOGU3N2Y2Nzk4MTEzMzczYmNkYjY2ZWQ2NjNjNmUzNDA2OGJmMGQxODVkIiwicGF0aCI6InR5cGVbMF0ifSx7InZhbHVlIjoiOGE5MGMxYmMxMDNlMzQzZDc3OGMxYzg0NGU2NmQzOTkxNTdhZmMyOTIzOTNkYTgxOTg3Yjk1ZTVhNjQwYjhhNyIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6IjQ5M2QyNzY5YTM3ZGYxMGFhODc0MTJkMmYyYTVmNWMzNmJiYmE2ZjRjNzc1N2FjMTQ0ZWRiNjhiNjY5NDU5YmQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiYjI0NzBhNzZjMzY5NDRhNWFhNGQ1NTZkZTEwM2RmNzA0ODYxNzZlYWU0YWNjMjU1NjBlZjg4YWJiOGY3MDhmMCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5jbGFzc1swXS50eXBlIn0seyJ2YWx1ZSI6IjMxZGUyMTdhZWYwZmE2ZTc2MjBiN2ZkZTE5YzliZjU1ZTc1M2RiYmU2NzJmYWNkNDA3MDNlMmNkZmJmOWRjYTUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiJjMGJjMGU1OWFjNTUxYmZlMzFiN2E0ZTFlMjc0YjBhZGI3MTBhYzJiYTEwOWFhYmJhNTg0NDU1ZWNhNzBiYzk0IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmNsYXNzWzFdLnR5cGUifSx7InZhbHVlIjoiMjcwZWVmZmEzYTM0ZDhkZGQ4NTg3ODExNjZlNTMwNWI3YzNlM2Q4N2JkZGY0Y2RkNDdjZDYyYjVjZDY3NmJmYyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5jbGFzc1sxXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjYyNTRmZmRiMjIxNWY0MWQwOWUzMmNlYmNlZThiY2YxMGQwNzA4ODc3ZmI0M2JhMWQ2ZTIwYTEzNDQ1ZWQwYjMiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEudGVtcGxhdGUubmFtZSJ9LHsidmFsdWUiOiIwM2UyMWZhYzQ3NTkyYjg1NTcyOTFjM2U3M2M4NmI0MGZhMDE1N2ZiYmFhZmRhMTk1MzU3ZDU4ZWRkMWJiOWYyIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnRlbXBsYXRlLnR5cGUifSx7InZhbHVlIjoiMGNlMmE1ZjQ0YjhlOWFiZDJkMmY0M2Q1NWI5MWVjNjNmZGRkZTg2YmRlZTdhMTVmODA1ODFlYjJkZTUwMWM2MyIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS50ZW1wbGF0ZS51cmwifSx7InZhbHVlIjoiYjE5ZWQ1ZjRmOTU3YzhiNTQwMGU5YTBiMDhlYjdkOGFiNGZmNjk3NDMwZmRhMDMxN2EyOGQ3YzE3MDgyN2YyZiIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi50eXBlIn0seyJ2YWx1ZSI6IjRkMzBhMmE4Mzg2M2MwZjI2OGZiYmVhNzI5ZDZlODc3ZDZjYTUyZTE3MGM2MTI2MjU0MGUxOWI4YjZiYWIzZDEiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6IjcwMTY3NjUwZDI2NjkwN2VjMjc5YTYyYzRiMmM4MmMwNzAwYzdhZWRmODdmNGFjZTNhNzVmZjgxZmVkYmYwOTAiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YudmFsdWUifSx7InZhbHVlIjoiZDhkY2E2M2RiOTRkM2Q5MzVhOGJmNDNhN2MxZDE4OGZjYjZjOTg0NjZlM2Q5Y2RmNzRkYjU0ZGUwNWUyNWU2NiIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi5yZXZvY2F0aW9uLnR5cGUifSx7InZhbHVlIjoiZjFlNWE5YzE5MGNkMjRiZjg5NDU0NDMzMDgzMGI0ZDdhZjU3NWM0YTJkYzJkMzkyNjZmODllODE3YTI1Y2Q0OCIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLnR5cGUifSx7InZhbHVlIjoiZDliYzA4ZGVlY2I1NDJjNjY5ZDVkMmRiMjA3OTkyNmMxYzdkZGFiNDFhNzU4M2ZlOGUwZjFkMmQxMGZhZWE0MSIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLmlkZW50aWZpZXIifSx7InZhbHVlIjoiYjMzOTYzMzAyZGMyMjJkNjFhNTM3YmQ2NjEzODE0ZjYyZmRmYjc2ODQyMGI0NGUxYWVkMzFiMTVkM2MxYjA4NSIsInBhdGgiOiJhdHRhY2htZW50c1swXS5maWxlTmFtZSJ9LHsidmFsdWUiOiI3M2EzZDM0MWJkMDBhMzEyYzIyZmU2OWJhNWU0MzJkMTdkNTExNWM4M2I4MzEwMjYwNDMxMjgzM2E2YjU2YWZjIiwicGF0aCI6ImF0dGFjaG1lbnRzWzBdLm1pbWVUeXBlIn0seyJ2YWx1ZSI6IjcxZmFkYmJhZmQzOTdmZWY3NTA2Mzc5N2U0YjQ2ZDk5ODE1ZDQ4MDIzODc5OTdjNGY5MjhhZjNiMGRmMmJjYjYiLCJwYXRoIjoiYXR0YWNobWVudHNbMF0uZGF0YSJ9XQ==",
      privacy: {
        obfuscated: [],
      },
      key: "did:ethr:0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69#controller",
      signature:
        "0xfc6263d95de0f9493037ac046755a25bfe022fd7d2afff7b70e7df892d8c4ce81a8274b42a08767823b112f101121e5ee9a48b896c3665cc23eb4cbf5219614f1b",
    });

    expect(file2.proof).toMatchObject({
      type: "OpenAttestationMerkleProofSignature2018",
      proofPurpose: "assertionMethod",
      targetHash: "1bc4623a09d52fbb35d23b38a6bf30a545df2c849adc8486eda1a5e0c60650ad",
      proofs: [],
      merkleRoot: "1bc4623a09d52fbb35d23b38a6bf30a545df2c849adc8486eda1a5e0c60650ad",
      salts:
        "W3sidmFsdWUiOiIzYmI2ZWQ5ZmJhOGI1NGQyNzM5MGU0MjIxN2RhOTdkMmFlYjY3Mjk2M2JiMzZjZTRkNmUyNmI4YzY3ZTMxMTkyIiwicGF0aCI6InZlcnNpb24ifSx7InZhbHVlIjoiNDM0MWZjNmQyOGY4MjMzMjU1YmU4MGZkNzBlNzQ2MjFhMDMzZGFmYzQ3Nzg1Mjg3NjFjMzA3ZDkyMDcyMDhkYyIsInBhdGgiOiJAY29udGV4dFswXSJ9LHsidmFsdWUiOiI3M2ExNWM2NDc3NjEzYWM2NGRhOTRkZWU3ZWEzOWNkMDI4MGQ5MTIzMmI3MmU2ODJlZjY5OTBhYmQxYTI2ZDNmIiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6Ijk3NmM0NDNmOWM0OTQ0YjRhZDJhY2YxNDBiM2NlODY2YzJmZmQxMzhlNjUwYTllMWRmOWJmYmZjMmRhMTYzN2QiLCJwYXRoIjoiQGNvbnRleHRbMl0ifSx7InZhbHVlIjoiNTdiZmQ4MDNlOGExY2FhZTUyNmI4NzUyOWQ5MTBjMzgwMzAzN2QxOGJiMTUxYTJjMDZlMTdiMDIyMTc1NzE2YyIsInBhdGgiOiJAY29udGV4dFszXSJ9LHsidmFsdWUiOiI1MGU4ZjI5MzZmZTk2NGYzZTBkOTAzNzEzNzEyNmEwNGMzMWFmYzVmNDZmMThhMDBmOTMxODg4N2UwMzZmODlkIiwicGF0aCI6InJlZmVyZW5jZSJ9LHsidmFsdWUiOiJmN2FhMzBhYzA3NzA1ZTY2OGFjNzNlMmFhZWEwYWVhOTY5NjVhYzM4ZDlhY2NiMWE1NmRmYTI2ZDgzODk5NDY5IiwicGF0aCI6Im5hbWUifSx7InZhbHVlIjoiNmQxZTRkMDQ0M2ZmY2ZjZjM4NzhjYzE0ZjQ2MzFiOTBkY2M5Y2VlMDdjMDMzZTQ2NWEyMzQ0NDFmYWY5ZGIwYiIsInBhdGgiOiJpc3N1YW5jZURhdGUifSx7InZhbHVlIjoiYjQwNzMyMjA0NGEwYzE5NjBhYjdhZTliNmIzOTNjZTJiN2VmMDUyYjc1ZGYyMzA0ZDhhNDNlZWRmY2U0MTE3NCIsInBhdGgiOiJ2YWxpZEZyb20ifSx7InZhbHVlIjoiZjA0OWVjYTdiNzY1ZGQ1YzMwNGM4MzVmZmExYzNmYzFkZDUwOTcyMGNhYzUxY2I0M2ViM2I4ZTM5NGU0ZGU1ZiIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMDNkOTQxMDgxYTNmMzczNjM5MTcyODE2NWRhZDg0OTY3Y2IzNjJhMDQxMjk3NzM3M2Q0YTU2NTU0ZjBlNTVmYyIsInBhdGgiOiJpc3N1ZXIubmFtZSJ9LHsidmFsdWUiOiJmZjU1YjYxYWFhZDJjM2IwNGNhYTE0YzE1ODdjNTcyZDQyM2RlNWI2ODhiNTYxMmU1NTZlZjBkNTFmM2NiNDNkIiwicGF0aCI6InR5cGVbMF0ifSx7InZhbHVlIjoiMmI4ZDE2ODBlNTFhMDQ2NmNhNDI4MDUxOWQyOGU3NWIyMTY1NTAwODNhOGI2ZTNmODRjZTA3NjNmOWJmZjNjMCIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6ImE5NjBhMDM1OWM1OGRhNWIwMDczMDQ5M2IwY2JmZjJhNTgwNzAxMWE2Y2Y5ZTY1NzdkYjA1OTA1MjIyY2U0MjgiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiMTBmNTFkYmY5OWJmYWUzNjNiNDQxYTQ1MGE4NjUzMDY4NGRiZGQwMmI0NTViNWQ5MGZjYmY1ZTNkNTllOGViMSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5jbGFzc1swXS50eXBlIn0seyJ2YWx1ZSI6IjEyNDYwNjRhZjM4NDE5OWQ5NzIwNDY1MWQ4ZTgxZDEwNDAxY2UzYmEyM2U1YzQ4NWFjZDVjYmE0M2FmNGZkNzgiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiI5ZjVjMjllZmQ2MDMzOTFmM2I1MTNiM2E0NTk2ZmYxNTE2MjMwOGQ2YzU4OGJiOTI0MDcyNjgzYWQwZTQ5MjUwIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmNsYXNzWzFdLnR5cGUifSx7InZhbHVlIjoiNTQxYzc2ODM3ZjA2MDBlMWQ4YWI5MzY3ZjY2YzFjYTA3YTZmNzlhMThhZTJjYWI0NTM5YmNjNTc1ZDY2OGQzYyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5jbGFzc1sxXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6Ijk2YmEzOGNhNGFkMGFjNGVmZTc5M2EzZjQ4MDMzMmFlMmM3ZWViZDU4NmMwNjY5Zjg3NjgxYjc3MjAyYjEzZTAiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEudGVtcGxhdGUubmFtZSJ9LHsidmFsdWUiOiI3ZDc1N2QyMjBmZDliNjY0ZTc3ODYwOTE4YjZkZGFkZWFiMjgyNDdjNjM2MTJmMmE1OTczY2RjZGJkYmM0NmYzIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnRlbXBsYXRlLnR5cGUifSx7InZhbHVlIjoiYWQzY2Y3ODg4ZTBhOTg1YWJkNjNlMDU0NDllNjM3OWUwZjQ4NTk0YmI3Y2NkMzFmMjU3NTA0ZmIzNWFmMjY0MCIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS50ZW1wbGF0ZS51cmwifSx7InZhbHVlIjoiMDM3MWZmMzRkYThjOWM1ZjBkZmQxNzM4YTVlNGZlOTU5MjQxNGY2ZjBjOTA2OWY2NTk1NDE4MGMwM2JjZWM3ZiIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi50eXBlIn0seyJ2YWx1ZSI6ImQwMWQzOGE4YWY3NDVlYWE0YWMwOGFkOThmYTAwM2MyYWJkNjVmYzE3NzljZGRmMzY1YjRhOTkyMmZkNWU1ZmMiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6IjkwOGJiODMwMGFkNTA4NThiY2FlNjgxYzA0YTk2NWFiNDg0M2MxNDM4MDM1YTllNmM3OTdjMGQ1ZmY1MjdhZTUiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YudmFsdWUifSx7InZhbHVlIjoiZTk1NmE3NjcyNGQyNTljM2I5ZDE3ZjY4Nzg4YzU2MTA1NzFjODdiZTkwMDhiNWM5MTk0ZTc2NjI5MDg2NWJkNiIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi5yZXZvY2F0aW9uLnR5cGUifSx7InZhbHVlIjoiOGRhNWNlODIxY2ZlNDg1NjM2ZDFjMzIzMTJiNjVkZDYyODM5NmQzYjlmZWI3YTUzZmJlZGQzNjQ5NjBlMzc4NiIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLnR5cGUifSx7InZhbHVlIjoiMjI5YzBjZDk2NzU5ZTFhY2U4MmY5OTI2YTkzNjdlYzExMWQwMmM2OWUwOTk5M2RkNmMzM2M4OGFiYjg3NjFiOSIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLmlkZW50aWZpZXIifSx7InZhbHVlIjoiZGEzYTYxNmFiYTc1MTQwNzU4OWJhMjk3MDllNTZhMjRmMzdhNDY2MzdlNmZiYmQzMTkwNzdmODU5NTRmYzY2OSIsInBhdGgiOiJhdHRhY2htZW50c1swXS5maWxlTmFtZSJ9LHsidmFsdWUiOiJlZjM3OGVhYjRhNjg1MzU5ZjZhM2Q2YTE2MmQzN2EzOTYzZGM4MDRhZjQyOWM3NDkyNzBjYWEyZTRhMThlZGJiIiwicGF0aCI6ImF0dGFjaG1lbnRzWzBdLm1pbWVUeXBlIn0seyJ2YWx1ZSI6IjYxNzJhYzlhODZhMDMzZGJkMDk4ODE0NGYxMGY2NzMxYjc4YjAxY2I4ZWMxMDQ0ZjY4MDBkMDFhYTZkZDBkZGYiLCJwYXRoIjoiYXR0YWNobWVudHNbMF0uZGF0YSJ9XQ==",
      privacy: {
        obfuscated: [],
      },
      key: "did:ethr:0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69#controller",
      signature:
        "0x58eefb7c8b43be2ffcdc895171779ae5fad3052bee3f396506d52018ef5088f74b4a19856f63e9e42846fcc31b29197d0b4cc86bd3eb2f5fdeda8ab364d4ed611c",
    });
  });
});