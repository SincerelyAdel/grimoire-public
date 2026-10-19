**`UVM_HEX`** — radix flags for printing and recording (`uvm_radix_enum`)

Selects how an integral value is formatted by `print()`, `sprint()`, `record()` and the `uvm_printer` methods. Use one as part of the flag argument of a `` `uvm_field_* `` macro, or as the radix argument of `printer.print_int()`.

**Declaration**

```systemverilog
typedef enum {
    UVM_BIN       = 'h1000000,
    UVM_DEC       = 'h2000000,
    UVM_UNSIGNED  = 'h3000000,
    UVM_UNFORMAT2 = 'h4000000,
    UVM_UNFORMAT4 = 'h5000000,
    UVM_OCT       = 'h6000000,
    UVM_HEX       = 'h7000000,
    UVM_STRING    = 'h8000000,
    UVM_TIME      = 'h9000000,
    UVM_ENUM      = 'ha000000,
    UVM_REAL      = 'hb000000,
    UVM_REAL_DEC  = 'hc000000,
    UVM_REAL_EXP  = 'hd000000,
    UVM_NORADIX   = 0
} uvm_radix_enum;
```

| Flag | Output for the value 60 in 8 bits |
| --- | --- |
| `UVM_HEX` | `'h3c` |
| `UVM_DEC` | `'d60` (signed) |
| `UVM_UNSIGNED` | `'d60` (unsigned) |
| `UVM_BIN` | `'b111100` |
| `UVM_OCT` | `'o74` |
| `UVM_STRING` | The bytes as characters |
| `UVM_TIME` | Formatted as a time |
| `UVM_NORADIX` | The printer's default, hexadecimal unless changed |

**Example**

```systemverilog
`uvm_object_utils_begin(fifo_transaction)
    `uvm_field_int(data,  UVM_DEFAULT | UVM_HEX)
    `uvm_field_int(delay, UVM_DEFAULT | UVM_DEC)
`uvm_object_utils_end

virtual function void do_print(uvm_printer printer);
    super.do_print(printer);
    printer.print_int("data",  data,  $bits(data),  UVM_HEX);
    printer.print_int("delay", delay, $bits(delay), UVM_UNSIGNED);
endfunction

// Change the default for one printer
uvm_default_printer.knobs.default_radix = UVM_DEC;
```

**Notes**

- Only one radix flag can be used per field.
- `printer.knobs.show_radix = 0` removes the `'h` / `'d` prefix.

**See also**: `UVM_ALL_ON`, `uvm_field_int`, `uvm_printer`, `do_print`
