# c++ addons (11.04.22)

- for compile c++ addon with node-gyp you need:
  1. specify your addon in binding.gyp
  2. run node-gyp configure
  3. run node-gyp build
  4. if you change the addong you need rebuild it by 3 step
- c++ addon can't import by import keyword https://nodejs.org/api/esm.html#esm_no_native_module_loading
- c++ code so complicated, for the experiment i used open source (from google) code and join it to one file
