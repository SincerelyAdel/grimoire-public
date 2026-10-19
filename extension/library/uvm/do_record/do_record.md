**`do_record`** — the hook you implement so that transaction recording shows your fields

`uvm_object::record()` calls the virtual `do_record(recorder)`. Override it to write your class's fields to the transaction database, so that a waveform viewer can display each transaction with its attributes alongside the signals.

**Signature**

```systemverilog
virtual function void do_record(uvm_recorder recorder);
```

**Example**

```systemverilog
class fifo_transaction extends uvm_sequence_item;
    `uvm_object_utils(fifo_transaction)

    rand logic [7:0]  data;
    rand int unsigned delay;
    bit               legal = 1'b1;

    virtual function void do_record(uvm_recorder recorder);
        super.do_record(recorder);
        `uvm_record_field("data",  data)
        `uvm_record_field("delay", delay)
        `uvm_record_attribute(recorder.tr_handle, "kind", legal ? "legal" : "illegal")
    endfunction
endclass

// Driver or monitor: bracket the transaction in time
task drive_item(fifo_transaction tr);
    void'(begin_tr(tr, "fifo_writes"));
    // ... drive ...
    end_tr(tr);
endtask
```

**Recording macros**

| Macro | Purpose |
| --- | --- |
| `` `uvm_record_field(NAME, VALUE) `` | Record one named value on the current recorder |
| `` `uvm_record_attribute(TR_HANDLE, NAME, VALUE) `` | Record a named value on a given transaction handle, using the simulator's native call |

UVM 1.2 adds typed forms: `` `uvm_record_int ``, `` `uvm_record_string ``, `` `uvm_record_time ``, `` `uvm_record_real ``.

**Notes**

- `end_tr()` calls `record()`, which calls `do_record()`, so you rarely call any of them yourself.
- Nothing is recorded unless recording is enabled for the component (`recording_detail` in the configuration database) and in the simulator.
- Fields registered with `` `uvm_field_* `` macros are recorded automatically, unless flagged `UVM_NORECORD`.
- Call `super.do_record(recorder)` first.

**See also**: `uvm_recorder`, `uvm_transaction`, `do_print`, `do_copy`, `uvm_object`
