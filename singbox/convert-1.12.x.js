//https://raw.githubusercontent.com/xishang0128/sub-store-template/refs/heads/main/1.12.x/sing-box.js
const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['all', 'all-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['HK', 'HK-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /港|hk|hong|🇭🇰/i))
  }
  if (['TW', 'TW-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /台|tw|taiwan|🇹🇼|🇨🇳/i))
  }
  if (['JP', 'JP-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /日本|jp|japan|🇯🇵/i))
  }
  if (['SG', 'SG-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:us)).*(新|sg|singapore|🇸🇬)/i))
  }
  if (['US', 'US-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /美|us|unitedstates|united states|🇺🇸/i))
  }
  if (['EU', 'EU-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /德|de|german|🇩🇪|荷|nl|nether|🇳🇱|英|gb|uk|kingdom|🇬🇧|意|it|🇮🇹|匈牙利|hungary|🇭🇺|芬兰|fi|🇫🇮|爱尔兰|ie|🇮🇪|欧|eu|🇪🇺/i))
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}
