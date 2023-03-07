import { Command, Option } from "commander";
import * as geoJsonMake from "../ts/geoJsonMake.js";
const optionsMakeAsync = async (commandlineOptions) => {
  console.log(commandlineOptions);
  const prefecture = commandlineOptions.prefecture;
  const workMunicipalities = commandlineOptions.municipalities;
  const workMeshWidths = commandlineOptions.meshWidths;
  const meshWidths = Array.isArray(workMeshWidths) ? workMeshWidths : workMeshWidths.split(",");
  const workDir = commandlineOptions.workDir ?? null;
  const outDir = commandlineOptions.outDir ?? workDir;
  if (prefecture === null || typeof prefecture === "undefined" || typeof geoJsonMake.PREFECTURE_CODE_NAMES[prefecture] === "undefined") {
    Object.keys(geoJsonMake.PREFECTURE_CODE_NAMES).sort().forEach((num) => {
      console.log(`${num} : ${geoJsonMake.PREFECTURE_CODE_NAMES[num]}`);
    });
    process.exit();
  }
  if (workMunicipalities === null || typeof workMunicipalities === "undefined") {
    const municipalitiesList = await geoJsonMake.getMunicipalitiesAsync(prefecture, workDir);
    municipalitiesList.forEach((cn) => {
      console.log(`${cn[0]} : ${cn[1]}`);
    });
    process.exit();
  }
  const municipalities = Array.isArray(workMunicipalities) ? workMunicipalities : workMunicipalities.split(",");
  return { prefecture, municipalities, outDir, workDir, meshWidths };
};
const mainAsync = async () => {
  const commander = new Command();
  commander.addOption(new Option("-w, --workDir <string>", "\u4F5C\u696D\u30D5\u30A9\u30EB\u30C0").default(null, "system\u306Etemp\u30D5\u30A9\u30EB\u30C0/mesh")).addOption(new Option("-o, --outDir <string>", "\u51FA\u529B\u5148\u30D5\u30A9\u30EB\u30C0").default(null, "system\u306Etemp\u30D5\u30A9\u30EB\u30C0/mesh")).addOption(new Option("-p, --prefecture <string>", "\u90FD\u9053\u5E9C\u770C\u756A\u53F7").default(null, "\u756A\u53F7\u30EA\u30B9\u30C8\u306E\u51FA\u529B")).addOption(new Option("-j, --municipalities <string>", "\u5E02\u533A\u753A\u6751\u30B3\u30FC\u30C9\uFF08\u30AB\u30F3\u30DE\u533A\u5207\u308A\uFF09").default(null, "\u81EA\u6CBB\u4F53\u3002\u756A\u53F7\u30EA\u30B9\u30C8\u306E\u51FA\u529B\uFF08\u90FD\u9053\u5E9C\u770C\u6307\u5B9A\u6642\uFF09")).addOption(new Option("-m, --meshWidths <string>", "\u30E1\u30C3\u30B7\u30E5\u5E45\uFF08\u30AB\u30F3\u30DE\u533A\u5207\u308A\uFF09").default("1km"));
  commander.parse(process.argv);
  const commandlieOptions = commander.opts();
  const options = await optionsMakeAsync(commandlieOptions);
  const result = await geoJsonMake.makeAsync(options);
  console.log(result);
};
await mainAsync();
