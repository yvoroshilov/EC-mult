document.querySelector('#btn-start-calc').addEventListener('click', function startCalculation() {
    const inputs = getFormInputs();
    let resp;
    if (inputs.numsys.value === 'dec') {
        resp = JSON.parse(multDec(
            inputs.p.value,
            inputs.a.value,
            inputs.b.value,
            inputs.gx.value,
            inputs.gy.value,
            inputs.d.value
        ));
    } else if (inputs.numsys.value === 'hex') {
        resp = JSON.parse(mult(
            inputs.p.value,
            inputs.a.value,
            inputs.b.value,
            inputs.gx.value,
            inputs.gy.value,
            inputs.d.value
        ));
    }

    inputs.time.value = resp.time;
    inputs.qx.value = resp.x;
    inputs.qy.value = resp.y;
});

document.querySelector('#btn-paste-from-stb').addEventListener('click', function pasteValuesFromStb() {
    const inputs = getFormInputs();
    if (inputs.numsys.value == 'dec') {
        inputs.p.value = '115792089237316195423570985008687907853269984665640564039457584007913129639747';
        inputs.a.value = '115792089237316195423570985008687907853269984665640564039457584007913129639744';
        inputs.b.value = '54189945433829174764701416670523239872420438478408031144987871676190519198705';
        inputs.gx.value = '0';
        inputs.gy.value = '48835626907528736105417095645674365354469331933013114027389791773001019124371';
        inputs.d.value = '47892955478961680371843095659317450143843863358676293558062931297569474962975';
    } else if (inputs.numsys.value == 'hex') {
        inputs.p.value = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF43';
        inputs.a.value = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF40';
        inputs.b.value = '77CE6C1515F3A8EDD2C13AABE4D8FBBE4CF55069978B9253B22E7D6BD69C03F1';
        inputs.gx.value = '0';
        inputs.gy.value = '6BF7FC3CFB16D69F5CE4C9A351D6835D78913966C408F6521E29CF1804516A93';
        inputs.d.value = '69E273C25F23790C9E423207ED1F283418F2749C32F033456739734BB8B5661F';
    }
});

document.querySelector('#btn-reset').addEventListener('click', function reset() {
});

document.querySelector('#dec').addEventListener('change', function() {
    const inputs = getFormInputs();
    for (let inputName in inputs) {
        if (inputName === 'time') continue;

        const input = inputs[inputName];
        if (input.type === 'text' && input.value !== '') {
            input.value = hexToDec(input.value);
        }
    }
});

document.querySelector('#hex').addEventListener('change', function() {
    const inputs = getFormInputs();
    for (let inputName in inputs) {
        if (inputName === 'time') continue;

        const input = inputs[inputName];
        if (input.type == 'text' && input.value !== '') {
            input.value = decToHex(input.value);
        }
    }
});

function decToHex(value) {
    return Module.ccall(
        'decToHex',	// name of C function
        'string',	// return type
        ['string'],	// argument types
        [value]	// arguments
    );
}

function hexToDec(value) {
    return Module.ccall(
        'hexToDec',	// name of C function
        'string',	// return type
        ['string'],	// argument types
        [value]	// arguments
    );
}

function mult(m, a, b, qx, qy, scalar) {
    return Module.ccall(
        'mult',	// name of C function
        'string',	// return type
        ['string', 'string', 'string', 'string', 'string', 'string'],	// argument types
        [m, a, b, qx, qy, scalar]	// arguments
    );
}

function multDec(m, a, b, qx, qy, scalar) {
    return Module.ccall(
        'multDec',	// name of C function
        'string',	// return type
        ['string', 'string', 'string', 'string', 'string', 'string'],	// argument types
        [m, a, b, qx, qy, scalar]	// arguments
    );
}

function getFormInputs(values = false) {
    const form = document.querySelector('#form');
    if (values) {
        return {
            numsys: form.elements['numsys'].value,
            p: form.elements['curve-p'].value,
            a: form.elements['curve-a'].value,
            b: form.elements['curve-b'].value,
            gx: form.elements['curve-gx'].value,
            gy: form.elements['curve-gy'].value,
            d: form.elements['curve-d'].value,
            time: form.elements['curve-time'].value,
            qx: form.elements['curve-qx'].value,
            qy: form.elements['curve-qy'].value
        }
    } else {
        return {
            numsys: form.elements['numsys'],
            p: form.elements['curve-p'],
            a: form.elements['curve-a'],
            b: form.elements['curve-b'],
            gx: form.elements['curve-gx'],
            gy: form.elements['curve-gy'],
            d: form.elements['curve-d'],
            time: form.elements['curve-time'],
            qx: form.elements['curve-qx'],
            qy: form.elements['curve-qy']
        }
    }
}





/*
https://livebook.manning.com/book/webassembly-in-action/b-ccall-cwrap-and-direct-function-calls/v-7/18
The ccall function allows you to call a function in the WebAssembly module and receive the results. The ccall function accepts four parameters:

A string indicating the name of the function in the module that you want to call. When Emscripten creates a WebAssembly module, it will add an underscore character before the function name. Don’t include the leading underscore character as the ccall function will include that for you.
The function’s return type. The following values can be specified:
null if the function returns void
'number' if the function returns an integer, float, or pointer
'string' if the function returns a char*. This is optional and is here for convenience. If used, the ccall function will handle the memory management of the returned string for you.
An array indicating the data types of the parameters. This array needs to have the same number of items as there are parameters to the function and it needs to be in the same order. The values that can be specified are:
'number' if the parameter is an integer, float, or pointer
'string' can be used for a char* parameter. If used, the ccall function will handle the memory management of the string for you. When using this approach, the value is considered temporary because the memory will be freed the moment the function returns.
'array' can be used but only for 8-bit array values.
An array of values to pass to the function. Each array item corresponds to the parameters of the function and must be in the same order.
The third parameter’s string and array data types are there for convenience by handling the work of creating a pointer, copying the value into memory, and then freeing that memory once the function call has completed. These values are considered to be temporary and will only be there while the function is executing. If the WebAssembly module code saves the pointer for future use, it may point to invalid data.

If you want objects to live longer then you need to allocate and deallocate the memory manually using the Emscripten functions _malloc and _free. In this case you wouldn’t use string or array for the parameter type but rather number because you’ll be passing a pointer directly and not using Emscripten’s memory management help.

If you need to pass an array that has values greater than 8-bit, 32-bit integers for example, then you’ll need to pass a pointer rather than the array type. Section B.3 shows how to pass an array to a module manually.
*/