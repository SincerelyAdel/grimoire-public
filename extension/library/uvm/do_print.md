**`do_print`** — the hook you implement so that `print()` and `sprint()` show your fields

`uvm_object::print()` and `sprint()` call the virtual `do_print(printer)`, which you override to add your class's fields to the output, using the methods of the `uvm_printer` passed in. The printer decides the layout: table, tree or single line.

**Signature**

```systemverilog
virtual function void do_print(uvm_printer printer);
```

**Example**

```systemverilog
class fifo_transaction extends uvm_sequence_item;
    `uvm_object_utils(fifo_transaction)

    rand logic [7:0]  data;
    rand int unsigned delay;
    bit               legal = 1'b1;
    fifo_cfg          cfg;

    virtual function void do_print(uvm_printer printer);
        super.do_print(printer);
        printer.print_int   ("data",  data,  $bits(data),  UVM_HEX);
        printer.print_int   ("delay", delay, $bits(delay), UVM_DEC);
        printer.print_string("kind",  legal ? "legal" : "illegal");
        printer.print_object("cfg",   cfg);
    endfunction
endclass

tr.print();
```

Output with the default table printer:

```
------------------------------------------------
Name      Type              Size  Value
------------------------------------------------
tr        fifo_transaction  -     @412
  data    integral          8     'h3c
  delay   integral          32    'd2
  kind    string            5     legal
  cfg     fifo_cfg          -     @377
    depth integral          32    'd16
------------------------------------------------
```

**Printer methods**

| Method | For |
| --- | --- |
| `print_int(name, value, size, radix)` | Integral values (`print_field` / `print_field_int` in UVM 1.2) |
| `print_string(name, value)` | Strings |
| `print_object(name, value)` | Nested objects, recursively |
| `print_time(name, value)` | Time values |
| `print_real(name, value)` | Reals |
| `print_generic(name, type_name, size, value)` | Anything else, already formatted as a string |
| `print_array_header(name, size)` / `print_array_footer()` | Around the elements of an array |

**Notes**

- Call `super.do_print(printer)` so base-class fields are included.
- Fields registered with `` `uvm_field_* `` macros are printed automatically, unless flagged `UVM_NOPRINT`.
- For a one-line message, implement `convert2string()` as well; `do_print` output is multi-line by default.
- Do not override `print()` or `sprint()` themselves.

**See also**: `uvm_printer`, `sprint`, `convert2string`, `do_copy`, `do_compare`, `UVM_HEX`
