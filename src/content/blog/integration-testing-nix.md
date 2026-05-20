---
title: Integration testing with Nix
description: A nice abstraction (magical, even)
pubDate: 2026-05-20
categories: ["post", "testing", "nix"]
---

I've recently been working on a TypeScript client library ([neoprom](https://github.com/thegu5/neoprom) for [Prometheus](https://prometheus.io)), which makes it easier for developers to instrument code for gathering metrics.
As part of this project, I want to have good tests that both cover the library's internal logic, as well as make sure it works properly with Prometheus.
So... what are the options?

1. Install Prometheus system-wide

Lots of problems: I'd rather not have it installed all the time, I'd have to wipe its database before running every test, and it'd be an extra setup step for new contributors with different steps depending on their OS (as well as their distro if on Linux).

2. Spin a container up and down

This would mean writing a messy `Containerfile`, and adding extra steps to the test script (start, stop, wipe state).

3. [Nix](https://nixos.org)

Or... I can take advantage of the existing test framework used for testing NixOS!
Here's a very basic example:
```nix
{ pkgs }:
pkgs.testers.runNixOSTest {
  name = "ping test";

  containers = {
    machine1 = { };
    machine2 = { };
  };

  testScript = ''
    start_all()
    machine1.succeed("ping -c 1 machine2")
    machine2.succeed("ping -c 1 machine1")
  '';
}
```
When ran, it starts two containers, then has them ping each other.

The true power of this tool comes with being able to assign each machine a NixOS configuration:
```nix
{
  pkgs,
  lib,
  src,
}:
pkgs.testers.runNixOSTest {
  name = "more advanced test";

  containers.app =
    { pkgs, ... }:
    {
      environment.systemPackages = [ pkgs.prometheus.cli ];
      systemd.services.metrics = {
        wantedBy = [ "multi-user.target" ];
        serviceConfig.ExecStart = "${lib.getExe pkgs.nodejs} ${src}/some-server.ts";
      };
      services.prometheus = {
        enable = true;
        # more configuration...
      };
    };

  testScript = ''
    start_all()
    app.wait_for_unit("metrics.service")
    app.wait_for_unit("prometheus.service")
    app.wait_for_open_port(9000)
    app.wait_for_open_port(9090)

    data = app.succeed("promtool query instant http://localhost:9090 some_total")
    # ...
  '';
}
```

The specific command to run the test depends on the project's setup.
You can look at [my non-flake setup](https://github.com/thegu5/neoprom/blob/main/default.nix) for inspiration, or take a peek at Jacek Galowicz's work below (Nixcademy).

Thanks for reading :)

### Resources
https://nixcademy.com/posts/faster-cheaper-nixos-integration-tests-with-containers/
([slides & example repo](https://github.com/applicative-systems/nixos-test-driver-nixcon))

https://nixos.org/manual/nixos/unstable/#sec-nixos-tests

https://nix.dev/tutorials/nixos/integration-testing-using-virtual-machines.html

