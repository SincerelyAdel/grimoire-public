**`uvm_macros.svh`** — the include file that defines every UVM macro

Macros are not part of a package, so importing `uvm_pkg` does not bring them in. Any file that uses `` `uvm_info ``, `` `uvm_component_utils `` or any other UVM macro must see this include first.

**Usage**

```systemverilog
package fifo_vip_pkg;
    import uvm_pkg::*;
    `include "uvm_macros.svh"

    `include "env/agent/objects/fifo_transaction.sv"
    `include "env/agent/components/drv/fifo_wr_driver.sv"
endpackage
```

**What it defines**

| Group | Examples |
| --- | --- |
| Factory registration | `` `uvm_component_utils ``, `` `uvm_object_utils ``, the `_param_` and `_begin`/`_end` forms |
| Field automation | `` `uvm_field_int ``, `` `uvm_field_object ``, `` `uvm_field_array_int `` |
| Reporting | `` `uvm_info ``, `` `uvm_warning ``, `` `uvm_error ``, `` `uvm_fatal `` and the `_context` forms |
| Sequences | `` `uvm_do ``, `` `uvm_do_with ``, `` `uvm_create ``, `` `uvm_send ``, `` `uvm_declare_p_sequencer `` |
| TLM | `` `uvm_analysis_imp_decl ``, `` `uvm_blocking_put_imp_decl `` |
| Callbacks | `` `uvm_register_cb ``, `` `uvm_do_callbacks `` |
| Version | `` `UVM_VERSION_STRING ``, `` `UVM_MAJOR_REV ``, `` `UVM_MINOR_REV `` |

**Notes**

- Macros follow compilation order, not scope. A file compiled before the include, in the same compilation unit, does not see them.
- The simulator must know where the file is: `xrun -uvm`, `vcs -ntb_opts uvm`, or `+incdir+$UVM_HOME/src`.
- Including it more than once is safe; it has include guards.

**See also**: `uvm_pkg`, `uvm_info`, `uvm_component_utils`
