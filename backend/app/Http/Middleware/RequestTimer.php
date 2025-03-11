<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RequestTimer
{
    public function handle($request, Closure $next)
    {
        // Enable query logging before any database operations
        DB::connection()->enableQueryLog();
        
        $start = microtime(true);
        $response = $next($request);
        $duration = microtime(true) - $start;
        
        // Get queries and their execution times
        $queries = DB::getQueryLog();
        $queryTimes = array_map(function($query) {
            return [
                'sql' => $query['query'],
                'time' => ($query['time'] ?? 0) / 1000,
                'bindings' => $query['bindings']
            ];
        }, $queries);
        
        Log::info('API Request Performance', [
            'path' => $request->path(),
            'method' => $request->method(),
            'duration' => round($duration * 1000, 2) . 'ms',
            'database_queries' => count($queries),
            'query_details' => $queryTimes
        ]);

        return $response;
    }
}