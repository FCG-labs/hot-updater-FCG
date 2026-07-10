import boxen from "boxen";
import picocolors from "picocolors";

export const link = (url: string) => {
  return picocolors.green(picocolors.underline(url));
};

export const banner = (version?: string) =>
  boxen(
    [
      `${picocolors.bold("Hot Updater")} ${version ? `v${version}` : ""}`,
    ].join("\n"),
    {
      padding: 1,
      borderStyle: "round",
      borderColor: "cyan",
      textAlignment: "center",
    },
  );

export const printBanner = (version?: string) => {
  console.log(banner(version));
};
