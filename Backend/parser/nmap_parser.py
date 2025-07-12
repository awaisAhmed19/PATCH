import json
from lxml import etree


def parse_nmap_xml(file_path):

    with open(file_path, "rb") as file:
        xml_data = file.read()

    root = etree.fromstring(xml_data)
    results = {"scan_summary": {"host_count": 0, "port_count": 0}, "hosts": []}

    for host in root.xpath("host"):
        ip_elem = host.find("address")
        if ip_elem is None:
            continue

        ip_address = ip_elem.get("addr")
        host_data = {"ip": ip_address, "ports": []}

        for port in host.xpath(".//port"):
            protocol = port.get("protocol")
            port_id = port.get("portid")

            state_elem = port.find("state")
            if state_elem is None or state_elem.get("state") != "open":
                continue

            service_elem = port.find("service")
            service_name = (
                service_elem.get("name") if service_elem is not None else "unknown"
            )
            product = (
                service_elem.get("product", "") if service_elem is not None else ""
            )
            version = (
                service_elem.get("version", "") if service_elem is not None else ""
            )

            host_data["ports"].append(
                {
                    "port": int(port_id),
                    "protocol": protocol,
                    "service": {
                        "name": service_name,
                        "product": product,
                        "version": version,
                    },
                }
            )
            results["scan_summary"]["port_count"] += 1

        if host_data["ports"]:
            results["hosts"].append(host_data)
            results["scan_summary"]["host_count"] += 1

    return results


# Test it with a file
if __name__ == "__main__":
    parsed = parse_nmap_xml("scanme.xml")
    print(json.dumps(parsed, indent=2))

    # Save to file
    with open("parsed_output.json", "w") as f:
        json.dump(parsed, f, indent=2)
