**`get_full_name`** — the hierarchical path of a component, or the name of an object

A virtual function available on every `uvm_object`. For a component it returns the dot-separated path from the top of the testbench. For a plain object it returns the same as `get_name()`. For a sequence or sequence item that is running, it returns the path of the sequencer that the root sequence runs on, followed by the chain of sequence names.

**Signature**

```systemverilog
virtual function string get_full_name();
```

**Example**

```systemverilog
// In fifo_wr_driver, instance drv
get_name()        // "drv"
get_full_name()   // "uvm_test_top.env.wr_agt.drv"
get_type_name()   // "fifo_wr_driver"

`uvm_info("FIFO_WR_DRV", {"I am ", get_full_name()}, UVM_LOW)

// As the context string when creating objects from a component
tr = fifo_transaction::type_id::create("tr", , get_full_name());

// As a scope for the resource database
uvm_resource_db #(int)::set({get_full_name(), ".*"}, "max_burst", 8, this);
```

**Where the path matters**

| Use | Example |
| --- | --- |
| Configuration scopes | `uvm_config_db::set(null, "uvm_test_top.env.wr_agt*", ...)` |
| Instance overrides | `set_inst_override_by_type(..., "uvm_test_top.env.wr_agt.drv")` |
| Report control | `+uvm_set_verbosity=uvm_test_top.env.scb,_ALL_,UVM_HIGH,run` |
| Reading a log | Every report line prints the full name of its source |

**Notes**

- The path is built from the instance names given to `create()`, not from variable names. Keeping the two identical makes paths predictable.
- The root component `uvm_top` has an empty name, so paths start at `uvm_test_top`.
- A sequence's full name depends on how it was started and is only meaningful afterwards. A child sequence takes its parent's full name as a prefix, even when it runs on a different sequencer: `wr_seq` started from `vseq` on `env.vsqr` is `uvm_test_top.env.vsqr.vseq.wr_seq`.

**See also**: `get_name`, `get_type_name`, `get_parent`, `uvm_component`, `uvm_test_top`, `uvm_config_db`
