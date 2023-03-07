
import fs from "fs/promises";
import url from "url";
import path from "path";
import {build} from "esbuild";

// このファイルが存在するフォルダ（commonjs形式の時にグローバルで設定されている__dirnameをmodule形式で使うための設定）
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
console.log("dirname", __dirname);

const tsBuild = async() => {
	const clibase = path.join(__dirname, "cli");
	console.log(clibase);
	const files = await fs.readdir(clibase);
	// console.log(files);
	const entrys = files.filter((file) => path.extname(file).toLowerCase() === ".ts")
		.map((file) => path.basename(file))
		.filter((file) => !(/^_/u).test(file))
		.map((file) => path.join(clibase, file));

	console.log(entrys);
	// const metafile = process.env.META_FILE === "true" || false;
	// , "//outfile": "public/index.js"
	return build({
		// define,
		"entryPoints": entrys
		, "bundle": false
		, "tsconfig": "tsconfig.cli.json"
		// ビルドされたバンドルの出力先
		, "outdir": "bin/"
		, "minify": false
		, "sourcemap": false
		, "format": "esm"
		, "platform": "node"
		, "target": ["es2022"]
		, "treeShaking": true // 不要なコード削除
	})
		.then((_result) => {
			console.log("ビルド完了");
		})
		.catch(() => process.exit(1));
};

await tsBuild();
