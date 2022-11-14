import { PassThrough } from 'stream';
import autocannon from 'autocannon';

function run(url) {
    const buf = [];
    const outPutStream = new PassThrough();

    const inst = autocannon({
        url,
        connections: 100,
        duration: 20
    })

    autocannon.track(inst , {outPutStream} )

    outPutStream.on('data', data => buf.push(data))
    inst.on('done', function () {
        process.stdout.write(Buffer.concat(buf))
    })
}

run('http://localhost:8080/info');