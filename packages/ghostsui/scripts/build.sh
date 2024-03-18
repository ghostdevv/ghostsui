compile_and_minify() {
    echo Processing \"$1\"
    sass src/$1.scss --no-source-map --load-path=node_modules | pnpm esbuild --loader=css --bundle --minify --outfile=$1.css
}

compile_and_minify ghostsui
compile_and_minify theme-park