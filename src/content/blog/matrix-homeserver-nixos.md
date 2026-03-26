---
title: Run Your Own Matrix Homeserver on NixOS
description: The power of nix!
pubDate: 2026-02-16
categories: ["howto", "matrix", "nix"]
---

Due to [current events](https://slate.com/technology/2026/02/discord-id-age-verification-online-safety.html),
alternatives to Discord have been getting a lot of attention recently. As much as I would love for [Matrix](https://matrix.org/) to
succeed here, it isn't ready for most non-technical users. However, if you want to tinker...

This guide assumes a few things:
- You'll be running the server on a computer that's publically accessible over the internet
- You have a domain that points to said machine
- Said machine is running [NixOS](https://nixos.org/)

Since "Matrix" is a protocol, there are several server implementations - with the most widely used (by far) being [Synapse](https://github.com/element-hq/synapse).
It was the first implementation, and it's used to host the official `matrix.org` server - however, it has performance issues and eats a bunch of RAM and CPU.
The main alternative, which is what this guide will use, is [Continuwuity](https://continuwuity.org/)[^1].

Continuwuity is packaged in nixpkgs and already has a NixOS module,
which makes the setup process just involve enabling the service and some settings: 
```nix
let
    your-domain = "example.com";
in
services.matrix-continuwuity = {
    enable = true;

    settings.global = {
        server_name = your-domain;

        new_user_displayname_suffix = "";

        address = null;
        unix_socket_path = "/run/continuwuity/continuwuity.sock";

        well_known.client = "https://matrix.${your-domain}";
        well_known.server = "matrix.${your-domain}:443";

        # just in case!
        lockdown_public_room_directory = true;
        allow_room_creation = false;
        require_auth_for_profile_requests = true; # no user enumeration
        url_preview_domain_explicit_allowlist = [ "github.com" ];

        log = "INFO,conduwuit_core::matrix::state_res=off"; # cleaner logs
    };
  };
```

We also need to expose the server to the public internet. [Caddy](https://caddyserver.com/) makes this super easy, handles TLS certificates automatically, etc.
```nix
let
    your-domain = "example.com";
in
services.caddy = {
    enable = true;
    virtualHosts = {
        "${your-domain}".extraConfig = ''
            reverse_proxy /.well-known/matrix/* unix//run/continuwuity/continuwuity.sock
        '';
        "matrix.${your-domain}".extraConfig = ''
            route {
                @api path /_matrix/* /_continuwuity/*
                reverse_proxy @api unix//run/continuwuity/continuwuity.sock
            }
        '';
    };
};
users.users.caddy.extraGroups = [ "continuwuity" ]; # give caddy access to continuwuity's unix socket
networking.firewall.allowedTCPPorts = [ 80 443 ];
networking.firewall.allowedUDPPorts = [ 443 ];
```

To test that the server is accessible to the wider network, you can use the [Matrix Federation Tester](https://federationtester.matrix.org/).

Now that the server is up, running and working, you need a client to use to connect. I prefer [Cinny](https://cinny.in/) since it's a self-contained web application and has a good UI, but there are [many others](https://matrix.org/ecosystem/clients/). You can use the official instance the developer runs at [app.cinny.im](https://app.cinny.im), or deploy your own:
```nix ins={6-31}
"matrix.${your-domain}".extraConfig = ''
    route {
        @api path /_matrix/* /_continuwuity/*
        reverse_proxy @api unix//run/continuwuity/continuwuity.sock

        root * ${
            pkgs.cinny.override {
                conf = {
                    defaultHomeserver = 0;
                    homeserverList = [ your-domain ];
                    allowCustomHomeservers = false;
                    featuredCommunities = {
                        openAsDefault = false;
                        spaces = [
                            "#community:matrix.org"
                            "#cinny-space:matrix.org"
                            "#space:continuwuity.org"
                            "#space:nixos.org"
                        ];
                        rooms = [ ];
                        servers = [
                            "matrix.org"
                            "mozilla.org"
                            "nixos.org"
                        ];
                    };
                };
            }
        }
        try_files {path} / index.html
        file_server
    }
'';
```

Now it's time to register your account! Your client will ask for a registration token, which is in the service logs:
```bash
sudo journalctl -u continuwuity | grep "registration token"
```

If you run into any issues, the [Continuwuity matrix space](https://matrix.to/#/#space:continuwuity.org) is super active and helpful. You might need to create an account on different server like `matrix.org` if your own isn't fully set up yet :)


[^1]: Of all the non-synapse servers - [Dendrite](https://github.com/element-hq/dendrite) is in maintenance mode, [Conduit](https://conduit.rs/) has less active development, and the primary maintainer of [Tuwunel](https://github.com/matrix-construct/tuwunel) is banned by the Matrix Foundation
