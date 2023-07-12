
using bimrepo;
using Google.FlatBuffers;

public class ClientLedger {

    private string address;
    private List<ECSComponent> modifiedComponents = new();

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

    public ClientLedger(string address)
    {
        this.address = address;
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
            commit.Diff?.UpdatedComponents.Add(component.exportToDataArray());
            var name = component.getSimplifiedName();
            if (!exportedTypes.ContainsKey(name))
            {
                exportedTypes[name] = true;
                commit.Diff?.UpdatedSchemas.Add(component.exportDefinitionToArray());
            }
        });

        var fbb = new FlatBufferBuilder(1);

        fbb.Finish(CommitProposal.Pack(fbb, commit).Value);

        var requestURL = $"{this.address}/commit";
        // do request with fbb
        using HttpClient client = new();
        var content = new ByteArrayContent(fbb.DataBuffer.ToFullArray());
        var response = await client.PostAsync(requestURL, content);
        var responseStream = await response.Content.ReadAsStreamAsync();

        var bytes = ReadFully(responseStream);

        var commitResponse = CommitResponseT.DeserializeFromBinary(bytes);

        return commitResponse.Id;
    }

    /*
Task<CommitProposalT> GetCommit(int id)
{
    let response = await axios.get(`${this.address}/commit/${id}`, {
        responseType: "arraybuffer"
    });
    let buf = toArrayBuffer(response.data);

    let commit = new CommitProposalT();
    CommitProposal.getRootAsCommitProposal(new flatbuffers.ByteBuffer(buf)).unpackTo(commit);

    return commit;
}
    */
}