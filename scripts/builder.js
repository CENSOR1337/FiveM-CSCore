const esbuild = require('esbuild');
const production = process.argv.findIndex(argItem => argItem === '--mode=production') >= 0;

const server = {
    platform: 'node',
    target: ['node16'],
    format: 'cjs',
};

const client = {
    platform: 'browser',
    target: ['chrome93'],
    format: 'iife',
};

async function build(context) {
    const esbuildOpt = {
        bundle: true,
        minify: production,
        entryPoints: [`src/${context}/${context}.ts`],
        outfile: `dist/${context}.js`,
        logLevel: 'info',
        tsconfig: `src/${context}/tsconfig.json`,
        ...(context === 'client' ? client : server),
    }

    const esbuildCtx = await esbuild.context(esbuildOpt);
    if (!production) {
        await esbuildCtx.watch()
    } else {
        await esbuildCtx.rebuild();
        await esbuildCtx.dispose();
    }
}
for (const context of ['client', 'server']) {
    build(context)
}