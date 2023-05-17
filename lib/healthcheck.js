const mjml2html = require('mjml');

const testInput = `<mjml>
                        <mj-body>
                            <mj-section>
                                <mj-column>
                                    <mj-text font-size="16px">Test</mj-text>
                                </mj-column>
                            </mj-section>
                        </mj-body>
                    </mjml>`

module.exports = {
    create: function (app, opts) {

        app.get('/health/liveness', function (req, res) {
            return res.json({ status: 'alive' })
        })

        app.get('/health/readiness', function (req, res) {
            try {
                const result = mjml2html(testInput, opts)
                if (!result) {
                    throw Error("No rendered output")
                }
                return res.json({ status: 'ready' })
            } catch (e) {
                return res
                    .status(500)
                    .json({ status: 'not ready', error: JSON.stringify(e) })
            }
        })
    }
}
