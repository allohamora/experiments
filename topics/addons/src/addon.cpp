#include <node.h>
#include <iostream>

using namespace v8;
using namespace std;

void HelloWorld(const FunctionCallbackInfo < Value > & args) {
  Isolate * isolate = args.GetIsolate();

  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "hello world").ToLocalChecked());
}

void Sum(const FunctionCallbackInfo < Value > & args) {
  Isolate * isolate = args.GetIsolate();

  // Check the number of arguments passed.
  if (args.Length() < 2) {
    // Throw an Error that is passed back to JavaScript
    isolate -> ThrowException(
      Exception::TypeError(String::NewFromUtf8(isolate, "Wrong number of arguments").ToLocalChecked())
    );
    return;
  }

  // Check the argument types
  if (!args[0] -> IsNumber() || !args[1] -> IsNumber()) {
    isolate -> ThrowException(
      Exception::TypeError(String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked())
    );
    return;
  }

  // Perform the operation
  double value = args[0].As < Number > () -> Value() + args[1].As < Number > () -> Value();
  Local < Number > num = Number::New(isolate, value);

  // Set the return value (using the passed in
  // FunctionCallbackInfo<Value>&)
  args.GetReturnValue().Set(num);
}

void Initialize(Local < Object > exports) {
  NODE_SET_METHOD(exports, "helloWorld", HelloWorld);
  NODE_SET_METHOD(exports, "sum", Sum);
}

NODE_MODULE(addon, Initialize);