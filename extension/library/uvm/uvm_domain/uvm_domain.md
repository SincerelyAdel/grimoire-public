**`uvm_domain`** — an independent copy of the run-time phase schedule

By default every component belongs to the `uvm` domain and steps through `reset`, `configure`, `main` and `shutdown` together. Placing some components in their own domain lets their run-time phases advance independently, which models subsystems that reset or power-cycle on their own.

**Declaration**

```systemverilog
class uvm_domain extends uvm_phase;
    function new(string name);
    static function uvm_domain get_common_domain();
    static function uvm_domain get_uvm_domain();
    static function void       get_domains(output uvm_domain domains[string]);
    function void jump(uvm_phase phase);
```

**Example**

```systemverilog
class soc_env extends uvm_env;
    `uvm_component_utils(soc_env)

    fifo_env   fifo_a;
    fifo_env   fifo_b;
    uvm_domain b_domain;

    function void build_phase(uvm_phase phase);
        super.build_phase(phase);
        fifo_a = fifo_env::type_id::create("fifo_a", this);
        fifo_b = fifo_env::type_id::create("fifo_b", this);
        b_domain = new("b_domain");
        fifo_b.set_domain(b_domain);       // hier = 1 by default: applies to children
    endfunction

    function void connect_phase(uvm_phase phase);
        // Keep both domains aligned at the start of main
        b_domain.sync(uvm_domain::get_uvm_domain(), uvm_main_phase::get());
    endfunction
endclass

// Later, reset only subsystem B:
b_domain.jump(uvm_reset_phase::get());
```

**Notes**

- Only the twelve run-time phases are per-domain. The common phases (`build` through `start_of_simulation`, `run`, `extract` through `final`) are always shared.
- `sync(target, phase)` makes a phase start at the same time in both domains; `unsync` removes it.
- Domains and phase jumps are advanced features. Most testbenches use the single default domain.

**See also**: `uvm_phase`, `reset_phase`, `main_phase`, `run_phase`
