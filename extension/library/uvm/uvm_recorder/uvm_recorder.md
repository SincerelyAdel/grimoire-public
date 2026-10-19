**`uvm_recorder`** — policy for recording object fields into a transaction database

Used by `record()` and the transaction recording that `begin_tr()` / `end_tr()` perform, so that transactions can be viewed alongside waveforms. The recorder writes each field through the simulator's transaction-recording interface.

**Methods used in `do_record`**

```systemverilog
virtual function void record_field    (string name, uvm_bitstream_t value, int size,
                                       uvm_radix_enum radix = UVM_NORADIX);
virtual function void record_field_real(string name, real value);
virtual function void record_object   (string name, uvm_object value);
virtual function void record_string   (string name, string value);
virtual function void record_time     (string name, time value);
virtual function void record_generic  (string name, string value);
```

**Example**

```systemverilog
virtual function void do_record(uvm_recorder recorder);
    super.do_record(recorder);
    `uvm_record_field("data", data)
    `uvm_record_field("delay", delay)
    recorder.record_string("kind", legal ? "legal" : "illegal");
endfunction
```

In a driver or monitor:

```systemverilog
void'(begin_tr(tr, "fifo_writes"));
// ... activity ...
end_tr(tr);
```

**Notes**

- Recording must be switched on. Set `recording_detail` in the configuration database to `UVM_LOW`, `UVM_MEDIUM`, `UVM_HIGH` or `UVM_FULL` for the component, and enable transaction recording in the simulator.
- UVM 1.2 reworked the back end into `uvm_tr_database` and `uvm_tr_stream`; `do_record` code is unaffected.
- Fields registered with field macros are recorded automatically unless flagged `UVM_NORECORD`.

**See also**: `do_record`, `uvm_transaction`, `uvm_object`, `uvm_printer`
