**`sprint`** — return an object's formatted contents as a string (`print`, `sprint`)

`print()` writes a formatted dump of an object to the log; `sprint()` returns the same text as a string, so it can be embedded in a report. Both use a `uvm_printer` for the layout and call your `do_print` hook, plus any field macros, for the content.

**Signatures**

```systemverilog
function void   print (uvm_printer printer = null);
function string sprint(uvm_printer printer = null);
```

| Argument | Meaning |
| --- | --- |
| `printer` | Layout policy. `null` uses `uvm_default_printer`, the table printer. |

**Example**

```systemverilog
// Multi-line table inside a message
`uvm_info("FIFO_MON", {"observed:\n", tr.sprint()}, UVM_HIGH)

// Single line
`uvm_info("FIFO_MON", tr.sprint(uvm_default_line_printer), UVM_HIGH)

// Tree
tr.print(uvm_default_tree_printer);

// A whole component subtree
env.print();
```

Table printer output:

```
--------------------------------------------
Name     Type              Size  Value
--------------------------------------------
tr       fifo_transaction  -     @412
  data   integral          8     'h3c
  delay  integral          32    'd2
--------------------------------------------
```

Line printer output:

```
tr: (fifo_transaction@412) { data: 'h3c  delay: 'd2  }
```

**Notes**

- Prefer `sprint()` inside `` `uvm_info `` over a bare `print()`: the message then obeys verbosity and carries the component path and time.
- An object that defines neither `do_print` nor field macros prints only its name and type.
- For frequent log lines, `convert2string()` is shorter and much cheaper.
- `print()` writes through `$display` to the file descriptor in `printer.knobs.mcd`, standard output by default.

**See also**: `do_print`, `uvm_printer`, `convert2string`, `print_topology`, `uvm_object`
