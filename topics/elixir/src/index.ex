Mix.install([
  {:plug_cowboy, "~> 2.6"}
])

defmodule SimpleServer do
  use Plug.Router

  plug :match
  plug :dispatch

  match _ do
    send_resp(conn, 200, "hello world")
  end
end

port = 4000

IO.puts("Server running at http://localhost:#{port}/")
Plug.Cowboy.http(SimpleServer, [], port: port)

Process.sleep(:infinity)
