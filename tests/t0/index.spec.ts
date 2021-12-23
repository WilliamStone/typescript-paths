import path from "path"
import { createHandler } from "../../src"

test("resolving", async () => {
	const handler = createHandler({ tsConfigPath: path.resolve(__dirname, "tsconfig.json") })
	expect(handler).toBeTruthy()

	const resolve = (request: string) => handler!(request, path.resolve(__dirname, "demo.ts"))
	expect(resolve("~/hello")).toEqual(path.resolve(__dirname, "hello.ts"))
	expect(resolve("~/qqq/hello")).toEqual(require.resolve(path.join(__dirname, "qqq/hello.js")))
	expect(resolve("@xxx/abc/xxx")).toEqual(path.resolve(__dirname, "xyz/abc/xyz.ts"))
	expect(resolve("@xxx/fff")).toEqual(path.resolve(__dirname, "abc/fff.js"))
	expect(resolve("#m/abc")).toEqual(path.resolve(__dirname, "xyz/abc/xyz.ts"))
	expect(resolve("#m/fff")).toEqual(path.resolve(__dirname, "abc/fff.js"))
	expect(resolve("roll")).toEqual(require.resolve("rollup"))
	expect(resolve("./t0/abc/App")).toBeFalsy()
	expect(resolve("rollup")).toBeFalsy()
	expect(resolve("@p")).toEqual(path.resolve(__dirname, "xx/qq.ts"))
	expect(resolve("@q")).toEqual(path.resolve(__dirname, "xx/ee.ts"))
	expect(resolve("#v")).toEqual(path.resolve(__dirname, "xx/vv.abs.ts"))
	expect(resolve("@v")).toEqual(path.resolve(__dirname, "xx/vv.abs.ts"))
})

test("support memory tsconfig", async () => {
	const handler = createHandler({
		tsConfigPath: {
			compilerOptions: {
				pathsBasePath: path.resolve(__dirname),
				paths: {
					"~/*": ["./*"],
					"@xxx/*/xxx": ["./xyz/*/xyz"],
					"@xxx/*": ["./abc/*"],
					"#m/*": ["./abc/*", "./xyz/*/xyz"],
					roll: ["../../node_modules/rollup"],
					"@p": ["./xx/qq.ts", "./xx/ff.ts"],
					"@q": ["./xx/ee.ts"],
					"#v": ["./xx/vv.abs"],
					"@v": ["./xx/vv.abs.ts"],
				},
			},
			fileNames: [path.resolve(__dirname, "demo.ts")],
		},
	})
	expect(handler).toBeTruthy()

	const resolve = (request: string) => handler!(request, path.resolve(__dirname, "demo.ts"))
	expect(resolve("~/hello")).toEqual(path.resolve(__dirname, "hello.ts"))
	expect(resolve("~/qqq/hello")).toEqual(require.resolve(path.join(__dirname, "qqq/hello.js")))
	expect(resolve("@xxx/abc/xxx")).toEqual(path.resolve(__dirname, "xyz/abc/xyz.ts"))
	expect(resolve("@xxx/fff")).toEqual(path.resolve(__dirname, "abc/fff.js"))
	expect(resolve("#m/abc")).toEqual(path.resolve(__dirname, "xyz/abc/xyz.ts"))
	expect(resolve("#m/fff")).toEqual(path.resolve(__dirname, "abc/fff.js"))
	expect(resolve("roll")).toEqual(require.resolve("rollup"))
	expect(resolve("./abc/App")).toBeFalsy()
	expect(resolve("rollup")).toBeFalsy()
	expect(resolve("@p")).toEqual(path.resolve(__dirname, "xx/qq.ts"))
	expect(resolve("@q")).toEqual(path.resolve(__dirname, "xx/ee.ts"))
	expect(resolve("#v")).toEqual(path.resolve(__dirname, "xx/vv.abs.ts"))
	expect(resolve("@v")).toEqual(path.resolve(__dirname, "xx/vv.abs.ts"))
})