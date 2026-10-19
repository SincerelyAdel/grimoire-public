**`set_inst_override`** — replace a type only at chosen places in the hierarchy

Like `set_type_override`, but limited to instances whose full path matches a pattern. Everything else of that type is created as usual. Use it to change one driver out of several, or the transactions of one agent only.

**Forms**

```systemverilog
// On the class's factory proxy
static function void T::type_id::set_inst_override(uvm_object_wrapper override_type,
                                                   string inst_path,
                                                   uvm_component parent = null);

// On a component: the path is relative to that component
function void set_inst_override_by_type(string relative_inst_path,
                                        uvm_object_wrapper original_type,
                                        uvm_object_wrapper override_type);
function void set_inst_override(string relative_inst_path,
                                string original_type_name, string override_type_name);

// On the factory: the path is absolute
function void set_inst_override_by_type(uvm_object_wrapper original_type,
                                        uvm_object_wrapper override_type,
                                        string full_inst_path);
function void set_inst_override_by_name(string original_type_name,
                                        string override_type_name,
                                        string full_inst_path);
```

`inst_path` may contain `*` and `?` wildcards.

**Example**

```systemverilog
function void build_phase(uvm_phase phase);
    // Only the write agent's driver becomes the slow variant
    fifo_wr_driver::type_id::set_inst_override(fifo_slow_wr_driver::get_type(),
                                               "env.wr_agt.drv", this);

    // Only items created by sequences started directly on the read sequencer are changed
    fifo_transaction::type_id::set_inst_override(fifo_no_delay_transaction::get_type(),
                                                 "env.rd_agt.sqr.*", this);

    // Only items created by the child sequence wr_seq of the virtual sequence vseq
    fifo_transaction::type_id::set_inst_override(fifo_no_delay_transaction::get_type(),
                                                 "env.vsqr.vseq.wr_seq.*", this);

    super.build_phase(phase);
endfunction
```

**How the path is matched**

| What is created | Path used for matching |
| --- | --- |
| A component | Its full hierarchical name: parent's full name plus instance name |
| An object created with a parent component | The parent's full name plus the object's name |
| An object created in a sequence | The context string passed to `create()`. With `` `uvm_do `` and `` `uvm_create `` this is the sequence's full name. |
| An object created with name only | Just the name, so no hierarchical pattern matches |

**The full name of a sequence**

A sequence's full name is built from its parents, not from the sequencer it happens to run on:

| How the sequence was started | Its full name |
| --- | --- |
| `seq.start(env.rd_agt.sqr)` | `uvm_test_top.env.rd_agt.sqr.seq` |
| `wr_seq.start(p_sequencer.wr_sqr, this)` from `vseq` running on `env.vsqr` | `uvm_test_top.env.vsqr.vseq.wr_seq` |

So a pattern on the agent's sequencer path does not match items sent by a child of a virtual sequence. Match on the virtual sequencer's path and the sequence names instead.

**Notes**

- The argument order differs between the forms: on a component the path comes first, on the factory it comes last.
- To make objects created by hand inside a sequence overridable by instance, pass the context: `fifo_transaction::type_id::create("req", , get_full_name())`.
- An instance override wins over a type override for the same original type.
- Among several matching instance overrides, the first one registered is used.

**See also**: `set_type_override`, `uvm_factory`, `type_id`, `uvm_set_type_override`, `get_full_name`
