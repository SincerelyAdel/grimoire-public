**`ignore_bins`** — values excluded from coverage

Values that are not counted and do not affect the coverage percentage, such as unreachable or uninteresting values.

```systemverilog
coverpoint mode {
  ignore_bins reserved = {[12:15]};
}
```
