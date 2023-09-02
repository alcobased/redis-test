{ pkgs }: {
  deps = [
		pkgs.nodePackages.prettier
    pkgs.redis
  ];
}