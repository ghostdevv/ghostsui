# GHOSTs UI

My personal styles I use across my projects. It's not intended for public use but feel free to, I attempt to follow semver as best as possible! It includes [`greset`](https://github.com/ghostdevv/greset), semantically applied styles, and a handful of utility classes.

# Use

You can use by importing it or via a cdn:

-   CDN (easiest method)

    ```html
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/ghostsui@2/ghostsui.css"
    />
    ```

-   When using bundlers such as vite or rollup

    ```bash
    npm install ghostsui -D
    ```

    ```js
    import 'ghostsui';
    ```

-   CSS Import
    
    ```bash
    npm install ghostsui
    ```

    ```css
    @import 'node_modules/ghostsui/ghostsui.css';
    ```

# Colours

SEE: https://ghostdevv.xyz/branding

# Theme Park

You can use ghostsui with [Theme Park](https://theme-park.dev/) by importing the following css file along with your theme park base file:

```css
@import url('https://cdn.jsdelivr.net/npm/ghostsui@2/theme-park.css');
```

For example, for Jellyfin you can do:

```css
@import url("https://theme-park.dev/css/base/jellyfin/jellyfin-base.css");
@import url("https://cdn.jsdelivr.net/npm/ghostsui@2/theme-park.css");
```
