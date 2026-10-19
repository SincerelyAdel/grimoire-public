**`rand`** — randomizable class property

Marks a class property to receive a new random value each time `randomize()` is called, subject to the constraints. Values may repeat. Use `randc` to cycle through all values before repeating.

```systemverilog
class packet;
  rand bit [7:0] len;
  rand bit [31:0] addr;
  constraint c_len { len inside {[1:64]}; }
endclass
```
