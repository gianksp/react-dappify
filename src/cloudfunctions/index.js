const logger = Moralis.Cloud.getLogger();

Moralis.Cloud.define("getTemplateByDomain", async (request) => {
  logger.info(`Debug----------------- ${request.params.data}`);
  return await getProjectFromUrl(request.params.url);
});

const getProjectFromUrl = async(url) => {
  logger.info(`[CALL] getProjectFromUrl with url ${url}`);
  const isDappifySubdomain = url.includes('dappify.com') || url.includes('dappify.us') || url.includes('dappify.cc');
  logger.info(`Is url a dappify subdomain? ${isDappifySubdomain}`);
  const hostname = new URL(url).hostname;
  const urlParts = hostname.split('.');
  const Project = Moralis.Object.extend("Project");
  const query = new Moralis.Query(Project);
  if (isDappifySubdomain) {
    const subdomain = urlParts.splice(0,urlParts.length-2).join('.');
    logger.info(`Loading project from subdomain ${subdomain}`);
  	query.equalTo("subdomain", subdomain);
  } else {
    const domain = urlParts.slice(0).slice(urlParts.length -2).join('.');
    logger.info(`Loading project from domain ${domain}`);
    query.equalTo("domain", domain);
  }
  const project = await query.first();
  logger.info(`Project found? ${project}`);
  return project;
};

Moralis.Cloud.afterSave(Moralis.User, async (request) => {
  const { object, original } = request;

  // Send notification for new onboarding
  const originalContact = original.get('contact');
  const newContact = object.get('contact');
  if (!originalContact && newContact !== originalContact) {
     	logger.info(`User added new contact info new: ${newContact}`);
		const config = await Moralis.Config.get({useMasterKey: true});
		const targetWebhookUrl = config.get('newUserDiscordWebhook');
        if (targetWebhookUrl) {
            Moralis.Cloud.httpRequest({
              method: 'POST',
              url: targetWebhookUrl,
              body: {
                content: `Give a warm welcome to ${object.get('nickname')} at his contact provided ${object.get('contact')}`
              }
            }).then(function(httpResponse) {
              logger.info(httpResponse.text);
            }, function(httpResponse) {
              logger.error('Request failed with response code ' + httpResponse.status);
            });
        } else {
        	logger.info(`New user webhook not configured`);
        }
  }
});

Moralis.Cloud.define("getProfileByHandle", async (request) => {
  const handle = request.params.handle;
  logger.info(`[CALL] getProfileByHandle with handle ${handle}`);
  const web3 = new Moralis.Web3(Moralis.provider);
  let isweb3 = web3.utils.isAddress(handle);
  const query = new Moralis.Query("User");
  if (isweb3)
    query.equalTo("ethAddress", handle.toLowerCase());
  else
  	query.equalTo("username", handle);

  const targetUser = await query.first({ useMasterKey: true });
  if (targetUser) {
    return {
    	ethAddress: targetUser.get('ethAddress'),
      	username: targetUser.get('username'),
        email: targetUser.get('email'),
      	profile: targetUser.get('profile'),
        bio: targetUser.get('bio'),
        provider: targetUser.get('provider'),
    }
  }
  return null;
});

Moralis.Cloud.define("userExists", async (request) => {
  const handle = request.params.handle;
  const email = request.params.email;
  logger.info(`[CALL] userExists with handle ${handle} and email ${email}`);
  const query = new Moralis.Query("User");
  if (email)
    query.equalTo("email", email);
  else
  	query.equalTo("username", handle);

  const targetUser = await query.first({ useMasterKey: true });
  return !!targetUser;
});
