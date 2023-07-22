
using bimrepo;
using Google.FlatBuffers;
using System.ComponentModel;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Xml.Linq;

public class ClientLedger {

    private string address;
    private List<ECSComponent> modifiedComponents = new();
    private Dictionary<string, UInt16> componentNameToID;
    private Dictionary<UInt16, string> componentIDToName;

    public ClientLedger(string address)
    {
        this.address = address;
        this.componentIDToName = new();
        this.componentNameToID = new();
    }

    public static byte[] ReadFully(Stream input)
    {
        byte[] buffer = new byte[16 * 1024];
        using (MemoryStream ms = new MemoryStream())
        {
            int read;
            while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
            {
                ms.Write(buffer, 0, read);
            }
            return ms.ToArray();
        }
    }

    public void update(ECSComponent component)
    {
        // TODO: check for duplicates
        this.modifiedComponents.Add(component);
    }

    public bool canCommit()
    {
        return this.modifiedComponents.Count != 0;
    }

    private UInt16 GetComponentID(string name)
    {
        if (this.componentNameToID.ContainsKey(name))
        {
            return this.componentNameToID[name];
        }
        var id = (UInt16)this.componentNameToID.Count;
        this.componentNameToID.Add(name, id);
        this.componentIDToName.Add(id, name);
        return id;
    }

    private ComponentIdentifierT ComponentToIdentifier(ECSComponent component)
    {
        var id = new ComponentIdentifierT();

        // entity id
        var uuidv4 = new uuidv4T();
        uuidv4.Values = component.getEntityID().bytes;
        id.Entity = uuidv4;

        id.ComponentType = this.GetComponentID(component.getSimplifiedName());
        id.ComponentIndex = 0; // temporarily hardcoded 1 component per entity

        return id;
    }

    public async Task<int> commit(string author, string message)
    {
        if (!this.canCommit()) throw new Exception($"No components to commit");

        var commit = new CommitProposalT(); 

        commit.Author = author;
        commit.Message = message;

        commit.Diff = new CommitDiffT();
        commit.Diff.UpdatedSchemas = new List<SchemaT>();
        commit.Diff.UpdatedComponents = new List<ComponentT>();

        var exportedTypes = new Dictionary<string, bool>();

        this.modifiedComponents.ForEach((component) => {
            var id = this.ComponentToIdentifier(component);
            var exported = component.exportToDataArray(id);
            commit.Diff?.UpdatedComponents.Add(exported);
            var name = component.getSimplifiedName();
            if (!exportedTypes.ContainsKey(name))
            {
                exportedTypes[name] = true;
                var data = component.exportDefinitionToArray(id.ComponentType);
                commit.Diff?.UpdatedSchemas.Add(data);
            }
        });

        var fbb = new FlatBufferBuilder(1);

        fbb.Finish(CommitProposal.Pack(fbb, commit).Value);

        var requestURL = $"{this.address}/commit";
        // do request with fbb
        var arr = fbb.DataBuffer.ToSizedArray();
        var content = new ByteArrayContent(arr);
        using HttpClient client = new();
        content.Headers.ContentType = new MediaTypeWithQualityHeaderValue("application/octet-stream");
        var response = await client.PostAsync(requestURL, content);
        var responseStream = await response.Content.ReadAsStreamAsync();

        var bytes = ReadFully(responseStream);

        var commitResponse = CommitResponseT.DeserializeFromBinary(bytes);

        return commitResponse.Id;
    }

    public async Task<CommitProposalT> GetCommit(int id)
    {
        using HttpClient client = new();
        var url = $"{this.address}/commit/{id}";
        var response = await client.GetAsync(url);
        var responseStream = await response.Content.ReadAsStreamAsync();
        var bytes = ReadFully(responseStream);

        return CommitProposalT.DeserializeFromBinary(bytes);
    }
}