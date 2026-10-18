**`` `uvm_object_utils_begin ``** — factory registration for an object, with field automation

The long form of `` `uvm_object_utils ``. It registers the class and opens a block of `` `uvm_field_* `` macros, closed by `` `uvm_object_utils_end ``. Each listed field is then handled automatically by `copy()`, `compare()`, `print()`, `sprint()`, `pack()`, `unpack()` and `record()`.

**Syntax**

```systemverilog
`uvm_object_utils_begin(TYPE)
    `uvm_field_*(FIELD, FLAG)
`uvm_object_utils_end
```

**Example**

```systemverilog
class fifo_transaction extends uvm_sequence_item;
    rand logic [7:0]  data;
    rand int unsigned delay;
    bit               legal = 1'b1;

    `uvm_object_utils_begin(fifo_transaction)
        `uvm_field_int(data,  UVM_DEFAULT | UVM_HEX)
        `uvm_field_int(delay, UVM_DEFAULT | UVM_DEC | UVM_NOCOMPARE)
        `uvm_field_int(legal, UVM_DEFAULT)
    `uvm_object_utils_end

    function new(string name = "fifo_transaction");
        super.new(name);
    endfunction
endclass

fifo_transaction a, b;
$cast(b, a.clone());            // deep copy, generated
if (!a.compare(b)) `uvm_error("CMP", "mismatch")
a.print();                      // table of data, delay, legal
```

**Notes**

- The macros expand to a large amount of code per field and are slower than hand-written `do_copy` / `do_compare`. For transactions created millions of times, prefer the `do_*` hooks.
- Errors inside the expansion are reported against the macro line, which makes them hard to read.
- The field macros and manual `do_*` methods can be mixed: the automation runs first, then the `do_*` hook.

**See also**: `uvm_object_utils`, `uvm_field_int`, `UVM_ALL_ON`, `do_copy`, `do_compare`, `do_print`
