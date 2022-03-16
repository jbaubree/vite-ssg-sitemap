# vite-ssg-sitemap

[![npm version](https://badgen.net/npm/v/vite-ssg-sitemap)](https://www.npmjs.com/package/vite-ssg-sitemap)
[![monthly downloads](https://badgen.net/npm/dm/vite-ssg-sitemap)](https://www.npmjs.com/package/vite-ssg-sitemap)
[![types](https://badgen.net/npm/types/vite-ssg-sitemap)](https://github.com/jbaubree/vite-ssg-sitemap/blob/main/src/types.ts)
[![Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/jbaubree/c7b3044dcd6c4203f33a3b93ca236ce1/raw/50691ecd5172277c1d3020224856b24883d44bb3/site-plugin-pages-sitemap__heads_master.json)](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/jbaubree/c7b3044dcd6c4203f33a3b93ca236ce1/raw/50691ecd5172277c1d3020224856b24883d44bb3/site-plugin-pages-sitemap__heads_master.json)
[![license](https://badgen.net/npm/license/vite-ssg-sitemap)](https://github.com/jbaubree/vite-ssg-sitemap/blob/main/LICENSE)

[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/jbaubree/vite-ssg-sitemap)

> sitemap generator working with vite-ssg

## Getting Started

### Vue

Install:

```bash
npm install -D vite-ssg
npm install -D vite-ssg-sitemap
npm install vue-router@next
```

### Vite config

Add to your `vite.config.js`:

```js
import generateSitemap from 'vite-ssg-sitemap'

export default {
  plugins: [
    Vue(),
  ],
  ssgOptions: {
    onFinished() { generateSitemap() },
  },
};
```

Now, run `npm build` and this will generate sitemap.xml and robots.txt files on your dist folder.

### hostname

- **Type:** `string`
- **Default:** `'http://localhost/'`

Base URI.

### dynamicRoutes

- **Type:** `string[]`
- **Default:** `[]`

Array of strings with manual dynamic routes.
```js
export default {
  plugins: [
    Vue(),
  ],
  ssgOptions: {
    onFinished() {
      const users = await api.get('/users')
      const dynamicRoutes = users.map(user => `/users/${user.name}`)
      generateSitemap({dynamicRoutes})
    },
  },
};
```

You can find a working example in example folder.

### outDir

- **Type:** `string`
- **Default:** `'dist'`

Output directory.

### changefreq

- **Type:** `string`
- **Default:** `'daily'`

Change frequency option for sitemap.

### priority

- **Type:** `number`
- **Default:** `1`

Priority option for sitemap.

### lastmod

- **Type:** `Date`
- **Default:** `new Date()`

Last modification option for sitemap.

### readable

- **Type:** `boolean`
- **Default:** `false`

Converts XML into a human readable format

### robots

- **Type:** `RobotOption[]`
- **Default:** `[{ userAgent: '*', allow: '/' }]`

Robots policy.

RobotOption:
- **userAgent**: `string`
- **allow**?: `string | string[]`
- **disallow**?: `string | string[]`
- **crawlDelay**?: `number`
- **cleanParam**?: `string`
 

## License

MIT License © 2022 [jbaubree](https://github.com/jbaubree)
