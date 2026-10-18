**`virtual`** — late binding, abstract class, or interface handle

Has three uses. On a class method, the call is resolved by the object's actual type instead of the handle's type. On a class, the class is abstract and cannot be constructed. Before an interface name, it declares a handle that lets class code reach a real interface instance.

```systemverilog
virtual class base;
  pure virtual function void run();
endclass

class driver;
  virtual bus_if vif;
endclass
```
