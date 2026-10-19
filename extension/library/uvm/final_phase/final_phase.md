**`final_phase`** — the last phase, for closing down

Runs after `report_phase`, as the last thing before the simulation finishes. It is a function, takes zero time and, unlike the other cleanup phases, executes top-down. Use it to release resources.

**Signature**

```systemverilog
virtual function void final_phase(uvm_phase phase);
```

**Typical uses**

- Close files opened for logging or for dumping results.
- Flush or close connections to external models and tools.
- Print anything that must come after every component's report.

**Example**

```systemverilog
class fifo_scoreboard extends uvm_scoreboard;
    UVM_FILE dump;

    function void start_of_simulation_phase(uvm_phase phase);
        dump = $fopen("fifo_items.csv", "w");
        $fdisplay(dump, "time,kind,data");
    endfunction

    function void write_wr(fifo_transaction tr);
        $fdisplay(dump, "%0t,wr,%0h", $time, tr.data);
    endfunction

    function void final_phase(uvm_phase phase);
        super.final_phase(phase);
        $fclose(dump);
    endfunction
endclass
```

**Notes**

- After this phase the library prints the report summary and, unless `uvm_top.finish_on_completion` is 0, calls `$finish`.
- It does not run if the simulation ends early through `UVM_EXIT`. For cleanup that must happen even then, override `pre_abort()` on the component.
- A SystemVerilog `final` block is the language-level equivalent for module code.

**See also**: `report_phase`, `check_phase`, `extract_phase`, `uvm_root`
