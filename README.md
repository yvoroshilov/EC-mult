https://andrea.corbellini.name/ecc/interactive/modk-mul.html
http://www.save-editor.com/tools/wse_hex.html
http://apmi.bsu.by/assets/files/std/bign-spec29.pdf

mkdir example

emcc EC/Project1/*.cpp EC/BigInteger.cpp EC/EllipticCurve.cpp EC/point.cpp -O3 -s WASM=1 \
-s EXPORTED_FUNCTIONS="['_test', '_mult', '_multDec', '_decToHex', '_hexToDec']" \
-s EXPORTED_RUNTIME_METHODS="['ccall','cwrap']" \
-o example/EC.html \
--shell-file assets/shell_minimal.html \
-s ERROR_ON_UNDEFINED_SYMBOLS=0 -s ASSERTIONS=1

cp assets/custom_script.js example