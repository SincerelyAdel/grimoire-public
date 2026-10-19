**`uvm_sequence_item`** — base class for transactions that flow from a sequence to a driver

The class to extend for any stimulus or monitored transaction. On top of `uvm_transaction` it records which sequence created the item and which sequencer it is running on, which is what allows `start_item()` / `finish_item()` and the response path to work.

**Declaration**

```systemverilog
class uvm_sequence_item extends uvm_transaction;
    function new(string name = "uvm_sequence_item");
```

**Main methods**

| Method | Purpose |
| --- | --- |
| `get_sequence_id()` | ID of the sequence that sent it; used to route responses |
| `set_id_info(uvm_sequence_item item)` | Copy sequence ID and transaction ID from a request into a response |
| `set_sequencer(uvm_sequencer_base)` / `get_sequencer()` | The sequencer the item runs on |
| `set_parent_sequence(uvm_sequence_base)` / `get_parent_sequence()` | The sequence that created it |
| `get_root_sequence()` / `get_root_sequence_name()` | Top of the sequence tree |
| `get_sequence_path()` | Full path of nested sequence names |
| `get_depth()` | Nesting depth |
| `is_item()` | 1 for an item, 0 for a sequence |

**Example**

```systemverilog
class fifo_transaction extends uvm_sequence_item;
    `uvm_object_utils(fifo_transaction)

    rand logic [7:0]  data;
    rand int unsigned delay;
    bit               legal = 1'b1;     // set by monitors, never randomized

    constraint delay_c { delay inside {[0:4]}; }

    function new(string name = "fifo_transaction");
        super.new(name);
    endfunction

    virtual function void do_copy(uvm_object rhs);
        fifo_transaction rhs_;
        super.do_copy(rhs);
        if (!$cast(rhs_, rhs)) `uvm_fatal("FIFO_TR", "do_copy: type mismatch")
        data  = rhs_.data;
        delay = rhs_.delay;
        legal = rhs_.legal;
    endfunction

    virtual function bit do_compare(uvm_object rhs, uvm_comparer comparer);
        fifo_transaction rhs_;
        if (!$cast(rhs_, rhs)) return 0;
        return super.do_compare(rhs, comparer) && data === rhs_.data;
    endfunction

    virtual function string convert2string();
        return $sformatf("data=0x%02h delay=%0d legal=%0b", data, delay, legal);
    endfunction
endclass
```

**Guidelines**

- Declare stimulus fields `rand`; leave observed or status fields non-`rand`.
- Keep the item free of timing and of interface handles. It describes what to do, and the driver decides how.
- Implement `do_copy`, `do_compare` and `convert2string` (or use field macros) so scoreboards and logs work.
- A monitor must create a new item for every observation, or clone before writing to an analysis port; subscribers keep the handle.

**See also**: `uvm_sequence`, `uvm_driver`, `uvm_transaction`, `uvm_object_utils`, `start_item`, `finish_item`, `set_id_info`
