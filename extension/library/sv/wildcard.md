**`wildcard`** — bins that match with don't-care bits

`wildcard bins` treat `x`, `z` and `?` in the bin values as matching either 0 or 1.

```systemverilog
coverpoint addr[3:0] {
  wildcard bins even = {4'b???0};
}
```
