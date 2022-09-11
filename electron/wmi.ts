import { spawn } from "child_process";
import xml2js from "xml2js";

class WMI {
    className: string;
    host: string = "localhost";
    namespace: string = "root\\CIMV2";
    username: string;
    password: string;
    where: string;
    props: string;

    constructor() {}

    setClassName(className: string) {
        this.className = className;
    }

    setHost(host: string) {
        this.host = host;
    }

    setNamespace(namespace: string) {
        namespace = namespace.replace(/\//g, "\\");
        this.namespace = namespace;
    }

    setUsername(username: string) {
        this.username = username;
    }

    setPassword(password: string) {
        this.password = password;
    }

    setWhere(where: string) {
        this.where = where;
    }

    setProps(props: string | string[]) {
        if (Array.isArray(props)) {
            props = props.join(",");
        }
        this.props = props;
    }

    exec = async () => {
        const args = this.getArgsArray();
        const child = spawn("wmic", args, { stdio: ["ignore", "pipe", "pipe"] });

        let stdout = "";
        let stderr = "";

        for await (const data of child.stdout) stdout += data;
        for await (const data of child.stderr) stderr += data;

        const code = await new Promise((resolve, reject) => {
            child.on("close", resolve);
            child.on("error", reject);
        });

        stdout = stdout.toString();
        stderr = stderr.toString();

        if (code !== 0) {
            stderr = stderr.replace(/ERROR:\r\r\n/, "");
            stderr = stderr.replace(/\r\r\n$/g, "").replace(/Description = /, "");
            return stderr;
        }

        const parser = new xml2js.Parser({ explicitArray: true });
        const output = await parser.parseStringPromise(stdout);

        if (!output.COMMAND.RESULTS[0].CIM) {
            return [];
        }

        return output.COMMAND.RESULTS[0].CIM[0].INSTANCE.map((instance) => {
            const props = {};
            if (instance.PROPERTY) {
                instance.PROPERTY.forEach((prop) => {
                    const propInfo = this.extractProperty(prop);
                    props[propInfo.name] = propInfo.value;
                });
            }
            if (instance["PROPERTY.ARRAY"]) {
                instance["PROPERTY.ARRAY"].forEach((prop) => {
                    const propInfo = this.extractProperty(prop);
                    props[propInfo.name] = propInfo.value;
                });
            }
            return props;
        });
    };

    getArgsArray() {
        const args = ["/NAMESPACE:\\\\" + this.namespace, "/NODE:'" + this.host + "'"];
        if (this.username) {
            args.push("/USER:'" + this.username + "'");
        }
        if (this.password) {
            args.push("/PASSWORD:'" + this.password + "'");
        }
        args.push("path");
        args.push(this.className);
        if (this.where) {
            if (typeof this.where === "string" && this.where.length) {
                args.push("Where");
                if (this.where.substr(0, 1) !== "(") {
                    this.where = "(" + this.where + ")";
                }
                args.push(this.where);
            } else if (Array.isArray(this.where) && this.where.length) {
                var str = "";
                for (var i = 0; i < this.where.length; i++) {
                    var tmp = this.where[i];
                    if (typeof tmp === "string") {
                        str += " And " + tmp;
                    } else if (typeof tmp === "object") {
                        str += " And " + this.where[i].property + "='" + this.where[i].value + "'";
                    }
                }
                str = "(" + str.replace(/^\sAnd\s/, "") + ")";
                if (str !== "()") {
                    args.push("Where");
                    args.push(str);
                }
            }
        }
        args.push("get");
        if (this.props) {
            let props = this.props;
            if (Array.isArray(props)) {
                props = props.join(",");
            }
            args.push(props);
        }
        args.push("/FORMAT:rawxml");
        return args;
    }

    extractProperty = function (prop) {
        let name;
        let type;
        let value;

        if ("$" in prop) {
            name = prop.$.NAME;
            type = prop.$.TYPE;
        } else {
            name = prop.NAME;
            type = prop.TYPE;
        }

        if ("VALUE" in prop) {
            value = prop.VALUE;
            if (Array.isArray(value)) {
                value = value[0];
            }
            value = this.typeValue(value, type);
        } else if (
            "VALUE.ARRAY" in prop &&
            prop["VALUE.ARRAY"].length > 0 &&
            prop["VALUE.ARRAY"][0].VALUE
        ) {
            value = [];
            for (var i = 0; i < prop["VALUE.ARRAY"][0].VALUE.length; i++) {
                value.push(this.typeValue(prop["VALUE.ARRAY"][0].VALUE[i], type));
            }
        }

        return { name: name, type: type, value: value };
    };

    typeValue = function (value, type) {
        if (value !== undefined) {
            const types = [
                "uint64",
                "uint32",
                "uint16",
                "uint8",
                "sint64",
                "sint32",
                "sint16",
                "sint8"
            ];
            if (types.indexOf(type) >= 0) {
                value = parseInt(value);
            } else if (["real64", "real32", "real16", "real8"].indexOf(type) !== -1) {
                value = parseFloat(value);
            } else if (type === "boolean") {
                if (value === "TRUE") {
                    value = true;
                } else {
                    value = false;
                }
            } else if (type === "datetime") {
                var valueDate = new Date(value);
                if (Object.prototype.toString.call(valueDate) === "[object Date]") {
                    // it is a date
                    if (valueDate.valueOf()) {
                        // date is valid
                        value = valueDate;
                    } else {
                        var formattedDate = value.match(
                            /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.(\d{6})([-]\d{3})/
                        );
                        if (formattedDate) {
                            value = new Date(
                                Date.UTC(
                                    formattedDate[1],
                                    formattedDate[2] - 1,
                                    formattedDate[3],
                                    formattedDate[4] - parseInt(formattedDate[8]) / 100,
                                    formattedDate[5],
                                    formattedDate[6],
                                    formattedDate[7]
                                )
                            );
                        }
                    }
                }
            }
        }
        return value;
    };
}

export default WMI;
