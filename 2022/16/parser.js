class Valve {
  constructor(id, rate, tunnels) {
    this.id = id;
    this.rate = rate;
    this.tunnels = tunnels;
  }
}

export const parser = line => {
  const r = line.match(/Valve (?<id>.*) has flow rate=(?<rate>\d+); tunnel(s)? lead(s)? to valve(s)? (?<tunnels>.*)/);

  return new Valve(
    r.groups.id,
    parseInt(r.groups.rate, 10),
    r.groups.tunnels.split(",").map(v => v.trim())
  );
};
