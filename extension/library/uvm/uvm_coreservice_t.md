**`uvm_coreservice_t`** — access point for the library's central services (UVM 1.2 and later)

A singleton introduced in UVM 1.2 that hands out the factory, the root, the report server and the other global services, and lets a testbench replace them. It replaces the global variables and scattered static accessors of UVM 1.1. It does not exist in UVM 1.1d.

**Declaration**

```systemverilog
virtual class uvm_coreservice_t;
    static function uvm_coreservice_t get();

    pure virtual function uvm_factory            get_factory();
    pure virtual function void                   set_factory(uvm_factory f);
    pure virtual function uvm_report_server      get_report_server();
    pure virtual function void                   set_report_server(uvm_report_server server);
    pure virtual function uvm_tr_database        get_default_tr_database();
    pure virtual function void                   set_default_tr_database(uvm_tr_database db);
    pure virtual function uvm_root               get_root();
    pure virtual function void                   set_component_visitor(uvm_visitor #(uvm_component) v);
    pure virtual function uvm_visitor #(uvm_component) get_component_visitor();
```

**Example**

```systemverilog
function void end_of_elaboration_phase(uvm_phase phase);
    uvm_coreservice_t cs      = uvm_coreservice_t::get();
    uvm_factory       factory = cs.get_factory();
    uvm_root          top     = cs.get_root();
    uvm_report_server server  = cs.get_report_server();

    factory.print();
    top.print_topology();
    server.set_max_quit_count(10);
endfunction
```

**Equivalents across versions**

| Service | UVM 1.1d | UVM 1.2 / IEEE |
| --- | --- | --- |
| Factory | `factory` or `uvm_factory::get()` | `cs.get_factory()` |
| Root | `uvm_top` or `uvm_root::get()` | `cs.get_root()` |
| Report server | `uvm_report_server::get_server()` | `cs.get_report_server()` |

**Notes**

- `uvm_factory::get()` and `uvm_root::get()` compile in every version, so prefer them in code that must run on both 1.1d and 1.2.

**See also**: `uvm_factory`, `uvm_root`, `uvm_report_server`, `uvm_top`
