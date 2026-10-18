**`uvm_printer`** — formatting policy for `print()` and `sprint()`

Controls how an object's fields are laid out when printed. The library provides three ready-made printers and a set of knobs for depth, radix, array truncation and column widths. Pass one to `print()` or `sprint()`, or change the defaults.

**Built-in printers**

| Class | Global instance | Output |
| --- | --- | --- |
| `uvm_table_printer` | `uvm_default_table_printer` | Table with Name, Type, Size, Value columns; the default |
| `uvm_tree_printer` | `uvm_default_tree_printer` | Indented tree with braces |
| `uvm_line_printer` | `uvm_default_line_printer` | Everything on one line |

`uvm_default_printer` is the one used when no printer is given; it starts as the table printer.

**Knobs** (`printer.knobs`)

| Knob | Default | Meaning |
| --- | --- | --- |
| `depth` | -1 | How many levels of nested objects to print; -1 is all |
| `default_radix` | `UVM_HEX` | Radix for integral fields without one |
| `begin_elements` / `end_elements` | 5 / 5 | Array elements shown at the start and end |
| `size`, `type_name`, `identifier`, `header`, `footer` | 1 | Show or hide columns and banners |
| `reference` | 1 | Print object handle IDs |
| `show_radix` | 1 | Prefix values with `'h`, `'d` |
| `indent` | 2 | Spaces per level |

**Methods used from `do_print`**

```systemverilog
virtual function void print_int   (string name, uvm_bitstream_t value, int size,
                                   uvm_radix_enum radix = UVM_NORADIX,
                                   byte scope_separator = ".", string type_name = "");
virtual function void print_string(string name, string value, byte scope_separator = ".");
virtual function void print_object(string name, uvm_object value, byte scope_separator = ".");
virtual function void print_time  (string name, time value, byte scope_separator = ".");
virtual function void print_real  (string name, real value, byte scope_separator = ".");
virtual function void print_generic(string name, string type_name, int size, string value,
                                    byte scope_separator = ".");
```

UVM 1.2 renames `print_int` to `print_field` / `print_field_int`; `print_int` remains as a deprecated alias.

**Example**

```systemverilog
virtual function void do_print(uvm_printer printer);
    super.do_print(printer);
    printer.print_int("data", data, $bits(data), UVM_HEX);
    printer.print_int("delay", delay, $bits(delay), UVM_DEC);
    printer.print_string("kind", legal ? "legal" : "illegal");
endfunction

// One-line form in a log message
`uvm_info("FIFO_MON", tr.sprint(uvm_default_line_printer), UVM_HIGH)

// Tree form with limited depth
uvm_tree_printer p = new();
p.knobs.depth = 2;
env.print(p);
```

**See also**: `do_print`, `sprint`, `convert2string`, `print_topology`, `UVM_HEX`, `uvm_object`
